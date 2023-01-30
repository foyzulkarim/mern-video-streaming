/** queue names: 
video.uploaded
video.processing
video.processed
video.hls-converting
video.hls.converted
video.watermarking
video.watermarked
*/

const QUEUE_EVENTS = {
  VIDEO_UPLOADED: "video.uploaded",
  VIDEO_PROCESSING: "video.processing",
  VIDEO_PROCESSED: "video.processed",
  VIDEO_HLS_CONVERTING: "video.hls-converting",
  VIDEO_HLS_CONVERTED: "video.hls.converted",
  VIDEO_WATERMARKING: "video.watermarking",
  VIDEO_WATERMARKED: "video.watermarked",
};

/** Each of the queue will have different queue handler function */

const uploadedHandler = async (job) => {
  console.log("i am the uploaded handler!", job.data.title);
  return { ...job.data, completed: true, next: QUEUE_EVENTS.VIDEO_PROCESSING };
};

const processingHandler = async (job) => {
  console.log("i am the processing handler!", job.data.title);
  return { ...job.data, completed: true, next: QUEUE_EVENTS.VIDEO_PROCESSED };
};

const processedHandler = async (job) => {
  console.log("i am the processed handler!", job.data.fieldname);
  return {
    ...job.data,
    completed: true,
    next: QUEUE_EVENTS.VIDEO_HLS_CONVERTING,
  };
};

const hlsConvertingHandler = async (job) => {
  console.log("i am the hls converting handler!", job.data.mimetype);
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

module.exports = { QUEUE_EVENTS, QUEUE_EVENT_HANDLERS };
