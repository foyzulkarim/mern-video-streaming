const {
  VIDEO_QUEUE_EVENTS: QUEUE_EVENTS,
  NOTIFY_EVENTS,
} = require('./constants');
const {
  processRawFileToMp4,
  processMp4ToHls,
  generateThumbnail,
} = require('./video-processor');
const { addQueueItem } = require('./queue');
const eventEmitter = require('../../event-manager').getInstance();

const uploadedHandler = async (job) => {
  console.log('uploaded handler!', job.data.title);
  await addQueueItem(QUEUE_EVENTS.VIDEO_PROCESSING, {
    ...job.data,
    completed: true,
  });
  return;
};

const processingHandler = async (job) => {
  console.log('processing handler!', job.data.path);
  await processRawFileToMp4(`./${job.data.path}`, `./uploads/processed`, {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_PROCESSED,
  });
  return;
};

const processedHandler = async (job) => {
  console.log('processed handler!', job.data.path);
  await addQueueItem(QUEUE_EVENTS.VIDEO_HLS_CONVERTING, {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_HLS_CONVERTING,
  });
  return;
};

const hlsConvertingHandler = async (job) => {
  console.log('HLS converting handler!', job.data.path);
  const hlsConverted = await processMp4ToHls(
    `./${job.data.path}`,
    `./uploads/hls`,
    {
      ...job.data,
      completed: true,
      next: QUEUE_EVENTS.VIDEO_HLS_CONVERTED,
    }
  );
  console.log('hlsConverted', hlsConverted);
  return;
};

const hlsConvertedHandler = async (job) => {
  console.log('hls converted handler!', job.data.filename);
  await addQueueItem(NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED, {
    ...job.data,
    completed: true,
    next: null,
  });
  return;
};

const notifyVideoHlsConvertedHandler = async (job) => {
  console.log('notifyVideoHlsConvertedHandler handler!', job.data);
  eventEmitter.emit(`${NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED}`, job.data);
  return { ...job.data, completed: true, next: null };
};

/** Each of the queue event will be associated with the handler and create an object */

const QUEUE_EVENT_HANDLERS = {
  [QUEUE_EVENTS.VIDEO_UPLOADED]: uploadedHandler,
  [QUEUE_EVENTS.VIDEO_PROCESSING]: processingHandler,
  [QUEUE_EVENTS.VIDEO_PROCESSED]: processedHandler,
  [QUEUE_EVENTS.VIDEO_HLS_CONVERTING]: hlsConvertingHandler,
  [QUEUE_EVENTS.VIDEO_HLS_CONVERTED]: hlsConvertedHandler,
  [NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED]: notifyVideoHlsConvertedHandler,
};

module.exports = {
  QUEUE_EVENT_HANDLERS,
};
