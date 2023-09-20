const app = require('./app');
const logger = require('./logger');
const { MongoManager } = require('./modules/db/mongo');
const { NOTIFY_EVENTS } = require('./modules/queues/constants');
const eventEmitter = require('./event-manager').getInstance();

const PORT = 4000;

const setup = async () => {  
  const { setup: setupVideoModule } =
    await require('./modules/models/video/controller');
  setupVideoModule(app);

  const { setup: setupRoleModule } =
    await require('./modules/models/role/controller');
    setupRoleModule(app);

  const { listenQueueEvent } = await require('./modules/queues/worker');
  listenQueueEvent(NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED);

  eventEmitter.on(NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED, (data) => {
    logger.info('NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED Event handler', data);
    io.emit('hello', data);
  });
};

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  logger.info('a user connected');
  logger.info(socket.id);

  // setInterval(() => {
  //   console.log("sending", new Date().toTimeString());
  //   io.emit("hello", "world", new Date().toTimeString());
  // }, 15000);
});

server.listen(PORT, async () => {
  logger.info(`listening on port ${PORT}`);
  await MongoManager.connect();
  await setup();
  logger.info('application setup completed');
  // which request, what handler
  app.use('/', (req, res) => {
    logger.info(`request received at ${new Date()}`);
    logger.info('req', req.body);
    //console.dir(res);
    res.send(`request received at ${new Date()}`);
  });

  logger.info('application started', new Date().toTimeString());
});
