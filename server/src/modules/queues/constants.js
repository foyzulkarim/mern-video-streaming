const VIDEO_QUEUE_EVENTS = {
  VIDEO_UPLOADED: 'video.uploaded',
  VIDEO_PROCESSING: 'video.processing',
  VIDEO_PROCESSED: 'video.processed',
  VIDEO_HLS_CONVERTING: 'video.hls-converting',
  VIDEO_HLS_CONVERTED: 'video.hls.converted',
};

const NOTIFY_EVENTS = {
  NOTIFY_VIDEO_HLS_CONVERTED: 'notify.video.hls.converted',
};

const ALL_EVENTS = {
  ...VIDEO_QUEUE_EVENTS,
  ...NOTIFY_EVENTS,
};

module.exports = { VIDEO_QUEUE_EVENTS, NOTIFY_EVENTS, ALL_EVENTS };
