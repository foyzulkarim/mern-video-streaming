const { QUEUE_EVENTS } = require("./constants");
const { processRawFileToMp4, processMp4ToHls } = require("./video-processor");
const { addQueueItem } = require("./queue");

const uploadedHandler = async (job) => {
  console.log("i am the uploaded handler!", job.data.title);
  await addQueueItem(QUEUE_EVENTS.VIDEO_PROCESSING, {
    ...job.data,
    completed: true,
  });
  return { added: true, next: QUEUE_EVENTS.VIDEO_PROCESSING };
};

const processingHandler = async (job) => {
  console.log("i am the processing handler!", job.data.path);
  const processed = await processRawFileToMp4(
    `./${job.data.path}`,
    `./uploads/processed`,
    {
      ...job.data,
      completed: true,
      next: QUEUE_EVENTS.VIDEO_PROCESSED,
    }
  );
  console.log("processed", processed);
  return { ...job.data, completed: true, next: QUEUE_EVENTS.VIDEO_PROCESSED };
};

const processedHandler = async (job) => {
  console.log("i am the processed handler!", job.data.path);
  await addQueueItem(QUEUE_EVENTS.VIDEO_HLS_CONVERTING, {
    ...job.data,
    completed: true,
  });
  return {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_HLS_CONVERTING,
  };
};

const hlsConvertingHandler = async (job) => {
  console.log("i am the hls converting handler!", job.data.path);
  const hlsConverted = await processMp4ToHls(
    `./${job.data.path}`,
    `./uploads/hls`,
    {
      ...job.data,
      completed: true,
      next: QUEUE_EVENTS.VIDEO_HLS_CONVERTED,
    }
  );
  console.log("hlsConverted", hlsConverted);
  return {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_HLS_CONVERTED,
  };
};

const hlsConvertedHandler = async (job) => {
  console.log("i am the hls converted handler!", job.data.filename);
  return {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_WATERMARKING,
  };
};

const watermarkingHandler = async (job) => {
  console.log("i am the watermarking handler!", job.data.size);
  return { ...job.data, completed: true, next: QUEUE_EVENTS.VIDEO_WATERMARKED };
};

const watermarkedHandler = async (job) => {
  console.log("i am the watermarked handler!", job.data.completed);
  return { ...job.data, completed: true, next: null };
};

/** Each of the queue event will be associated with the handler and create an object */

const QUEUE_EVENT_HANDLERS = {
  [QUEUE_EVENTS.VIDEO_UPLOADED]: uploadedHandler,
  [QUEUE_EVENTS.VIDEO_PROCESSING]: processingHandler,
  [QUEUE_EVENTS.VIDEO_PROCESSED]: processedHandler,
  [QUEUE_EVENTS.VIDEO_HLS_CONVERTING]: hlsConvertingHandler,
  [QUEUE_EVENTS.VIDEO_HLS_CONVERTED]: hlsConvertedHandler,
  [QUEUE_EVENTS.VIDEO_WATERMARKING]: watermarkingHandler,
  [QUEUE_EVENTS.VIDEO_WATERMARKED]: watermarkedHandler,
};

module.exports = {
  QUEUE_EVENT_HANDLERS,
};
