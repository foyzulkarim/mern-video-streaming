const { connect } = require('./modules/db/mongo');

const { setupAllQueueEvents } = require('./modules/queues/worker');

const setup = async () => {
  const db = await connect('mongodb://localhost:27017');
  const { updateSchema } = await require('./modules/models/video/schema');
  await updateSchema(db);
  const status = setupAllQueueEvents(db);
  console.log('setupAllQueueEvents: ', status);
};

setup();
