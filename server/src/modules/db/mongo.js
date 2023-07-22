const fs = require('fs');
const path = require('path');

const { MongoClient } = require('mongodb');

// Singleton design pattern
class MongoManager {
  static setInstance(instance) {
    if (!MongoManager.instance) {
      console.log('setting instance');
      MongoManager.instance = instance;
    }
  }

  static get Instance() {
    return MongoManager.instance;
  }

  static connect = async () => {
    if (MongoManager.instance) return MongoManager.instance;

    const mongoUrl = process.env.MONGODB_URL ?? 'mongodb://localhost:27017';
    const client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
    });
    console.log('connecting to MongoDB');
    await client.connect();
    _db = client.db('videodb');
    console.log('connected to MongoDB');
    MongoManager.setInstance(_db);
    return _db;
  };
}

let _db = null;

// export them
module.exports = {
  MongoManager,
};
