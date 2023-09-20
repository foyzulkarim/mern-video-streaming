const fs = require('fs');
const path = require('path');

const winston = require('winston');
const winstonMongo = require('winston-mongodb');

const { MongoClient } = require('mongodb');

const logger = require('../../logger');

// Singleton design pattern
class MongoManager {
  static async setInstance(instance) {
    if (!MongoManager.instance) {
      logger.info('setting instance');
      MongoManager.instance = instance;
    }
  }

  static get Instance() {
    return MongoManager.instance;
  }

  static updateSchemas = async () => {
    const directoryPath = path.join(__dirname, 'schemas');
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const { updateSchema } = require(filePath);
      if (updateSchema) await updateSchema(MongoManager.instance);
    }
  };

  static connect = async () => {
    if (MongoManager.instance) return MongoManager.instance;

    const mongoUrl = process.env.MONGODB_URL ?? 'mongodb://localhost:27017';
    const client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
    });
    logger.info('connecting to MongoDB');
    await client.connect();
    const db = client.db('videodb');
    if (process.env.ENABLE_WINSTON_MONGODB === 'true') {
      try {
        logger.add(
          new winston.transports.MongoDB({
            db,
            collection: 'logs',
            storeHost: true,
            level: 'info',
          })
        );
      } catch (error) {
        logger.error(error);
      }
    }

    logger.info('connected to MongoDB');
    await MongoManager.setInstance(db);
    await MongoManager.updateSchemas();

    return db;
  };
}

// export them
module.exports = {
  MongoManager,
};
