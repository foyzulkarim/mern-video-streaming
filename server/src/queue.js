require('dotenv').config();
const { MongoManager } = require('./modules/db/mongo');

const { setupAllQueueEvents } = require('./modules/queues/worker');

const setup = async () => {
  const db = await MongoManager.connect();
  const { updateSchema } = await require('./modules/models/video/schema');
  await updateSchema();
  const status = setupAllQueueEvents(db);
  console.log('setupAllQueueEvents: ', status);
};

setup();
