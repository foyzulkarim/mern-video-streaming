const { Queue } = require("bullmq");
const { ALL_EVENTS: QUEUE_EVENTS } = require("./constants");
const redisConnection = { host: "localhost", port: 6379 };

const queues = Object.values(QUEUE_EVENTS).map((queueName) => {
  return {
    name: queueName,
    queueObj: new Queue(queueName, { connection: redisConnection }),
  };
});

const addQueueItem = async (queueName, item) => {
  const queue = queues.find((q) => q.name === queueName);
  if (!queue) {
    throw new Error(`queue ${queueName} not found`);
  }
  await queue.queueObj.add(queueName, item, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};

module.exports = { addQueueItem };
