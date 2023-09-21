const { Queue } = require('bullmq');
const { ALL_EVENTS: QUEUE_EVENTS } = require('./constants');
const logger = require('../../logger');
const eventEmitter = require('../../event-manager').getInstance();

const redisConnection = {
  host: process.env.REDIS_SERVER || 'localhost',
  port: 6379,
};

const queues = Object.values(QUEUE_EVENTS).map((queueName) => {
  return {
    name: queueName,
    queueObj: new Queue(queueName, { connection: redisConnection }),
  };
});

const addQueueItem = async (queueName, item) => {
  logger.info('addQueueItem', queueName, item);
  const queue = queues.find((q) => q.name === queueName);
  if (!queue) {
    throw new Error(`queue ${queueName} not found`);
  }

  // TODO: update history : { status: queueName, createdAt: now }
  eventEmitter.emit(`${queueName}`, item);
  await queue.queueObj.add(queueName, item, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};

module.exports = { addQueueItem };
