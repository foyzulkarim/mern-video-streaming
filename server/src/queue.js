require('dotenv').config();
const { MongoManager } = require('./modules/db/mongo');

const { setupAllQueueEvents } = require('./modules/queues/worker');

const setup = async () => {
  await MongoManager.connect();  
  const status = setupAllQueueEvents();
  console.log('setupAllQueueEvents: ', status);
};

setup();
