const eventEmitter = require('../../../event-manager').getInstance();
const { VIDEO_QUEUE_EVENTS } = require('../../queues/constants');
const { updateHistory } = require('./service');

const setup = () => {
  // eventEmitter.on(VIDEO_QUEUE_EVENTS.VIDEO_UPLOADED, (data) => {
  //   console.log('VIDEO_QUEUE_EVENTS.VIDEO_UPLOADED Event handler', data);
  // });
  console.log('registering video queue events');
  Object.values(VIDEO_QUEUE_EVENTS).forEach((eventName) => {
    eventEmitter.on(eventName, async (data) => {
      console.log(`models/video/handler.js - ${eventName}`, data);
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
