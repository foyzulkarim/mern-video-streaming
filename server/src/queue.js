require('dotenv').config();
const { connect } = require('./modules/db/mongo');

const { setupAllQueueEvents } = require('./modules/queues/worker');

const setup = async () => {
  const db = await connect();
  const { updateSchema } = await require('./modules/models/video/schema');
  await updateSchema(db);
  const status = setupAllQueueEvents(db);
  console.log('setupAllQueueEvents: ', status);
};

setup();
