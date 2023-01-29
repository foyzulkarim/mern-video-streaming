/** queue names: 
video.uploaded
video.processing
video.processed
video.hls-converting
video.hls.converted
video.watermarking
video.watermarked
*/

const QUEUES = {
  VIDEO_UPLOADED: "video.uploaded",
  VIDEO_PROCESSING: "video.processing",
  VIDEO_PROCESSED: "video.processed",
  VIDEO_HLS_CONVERTING: "video.hls-converting",
  VIDEO_HLS_CONVERTED: "video.hls.converted",
  VIDEO_WATERMARKING: "video.watermarking",
  VIDEO_WATERMARKED: "video.watermarked",
};

module.exports = { QUEUES };
