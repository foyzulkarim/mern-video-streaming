require('dotenv').config();
const logger = require('./logger');
const { MongoManager } = require('./modules/db/mongo');

const { setupAllQueueEvents } = require('./modules/queues/worker');

const setup = async () => {
  await MongoManager.connect();  
  const status = setupAllQueueEvents();
  logger.info('setupAllQueueEvents: ', status);
};

setup();
