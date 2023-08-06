const eventEmitter = require('../../../event-manager').getInstance();
const { VIDEO_QUEUE_EVENTS } = require('../../queues/constants');
const { updateHistory, update } = require('./service');
const { PUBLISHED_STATUS } = require('../../db/constant')

const setup = () => {
  // eventEmitter.on(VIDEO_QUEUE_EVENTS.VIDEO_UPLOADED, (data) => {
  //   console.log('VIDEO_QUEUE_EVENTS.VIDEO_UPLOADED Event handler', data);
  // });

  const SERVER_URL = process.env.SERVER_URL;

  Object.values(VIDEO_QUEUE_EVENTS).forEach((eventName) => {

    eventEmitter.on(eventName, async (data) => {

      if (eventName === VIDEO_QUEUE_EVENTS.VIDEO_PROCESSED) {
        await updateHistory(data.id, {
          history: { status: eventName, createdAt: new Date() },
          processedPath: data.path,
        });
        return;
      }

      if (eventName === VIDEO_QUEUE_EVENTS.VIDEO_HLS_CONVERTED) {
        await updateHistory(data.id, {
          history: { status: eventName, createdAt: new Date() },
          hlsPath: data.path,
        });
        
        await update({ 
          _id: data.id,
          status: PUBLISHED_STATUS
        });

        return;
      }

      if (eventName === VIDEO_QUEUE_EVENTS.VIDEO_THUMBNAIL_GENERATED) {
        await updateHistory(data.id, {
          history: { status: eventName, createdAt: new Date() },
          thumbnailPath: data.path,
          thumbnailUrl: `${SERVER_URL}/thumbnails/${data.filename}.png`,
        });
        return;
      }

      await updateHistory(data.id, {
        history: { status: eventName, createdAt: new Date() },
      });
    });
  });
};

module.exports = {
  setup,
};
