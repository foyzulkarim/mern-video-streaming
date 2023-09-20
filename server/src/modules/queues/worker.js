const { Worker, QueueEvents } = require('bullmq');
const { VIDEO_QUEUE_EVENTS } = require('./constants');
const { QUEUE_EVENT_HANDLERS } = require('./handlers');
const logger = require('../../logger');

const redisConnection = {
  host: process.env.REDIS_SERVER || 'localhost',
  port: 6379,
};

const listenQueueEvent = (queueName) => {
  const queueEvents = new QueueEvents(queueName, {
    connection: redisConnection,
  });

  // queueEvents.on("waiting", ({ jobId }) => {
  //   console.log(`A job with ID ${jobId} is waiting`);
  // });

  // queueEvents.on("active", ({ jobId, prev, ...others }) => {
  //   console.log(
  //     `Job ${jobId} is now active; previous status was ${prev}`,
  //     others
  //   );
  // });

  // queueEvents.on("completed", ({ jobId, returnvalue }) => {
  //   console.log(`${jobId} has completed and returned.next`);
  // });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.info(`${jobId} has failed with reason ${failedReason}`);
  });

  const worker = new Worker(
    queueName,
    async (job) => {
      const handler = QUEUE_EVENT_HANDLERS[queueName];
      if (handler) {
        return await handler(job);
      }
      throw new Error('No handler found for queue: ' + queueName);
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job) => {
    logger.info(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    logger.info(`${job.id} has failed with ${err.message}`);
  });

  logger.info(queueName, ' worker started', new Date().toTimeString());
};

const setupAllQueueEvents = () => {
  Object.values(VIDEO_QUEUE_EVENTS).map((queueName) =>
    listenQueueEvent(queueName)
  );

  const { setup: setupVideoHandler } = require('../models/video/handler');
  setupVideoHandler();
  return true;
};

module.exports = { setupAllQueueEvents, listenQueueEvent };
