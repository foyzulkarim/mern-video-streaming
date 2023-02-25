const { setupAllQueueEvents } = require('./modules/queues/worker');

const status = setupAllQueueEvents();
console.log('setupAllQueueEvents: ', status);
