const app = require('./app');
const { MongoManager } = require('./modules/db/mongo');
const { NOTIFY_EVENTS } = require('./modules/queues/constants');
const eventEmitter = require('./event-manager').getInstance();

const PORT = 4000;

const setup = async () => {
  const { updateSchema } = await require('./modules/models/video/schema');
  await updateSchema();
  const { setup: setupVideoModule } =
    await require('./modules/models/video/controller');
  setupVideoModule(app);

  const { setup: setupRoleModule } =
    await require('./modules/models/role/controller');
    setupRoleModule(app);

  const { listenQueueEvent } = await require('./modules/queues/worker');
  listenQueueEvent(NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED);

  eventEmitter.on(NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED, (data) => {
    console.log('NOTIFY_EVENTS.NOTIFY_VIDEO_HLS_CONVERTED Event handler', data);
    io.emit('hello', data);
  });
};

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('a user connected');
  console.dir(socket.id);

  // setInterval(() => {
  //   console.log("sending", new Date().toTimeString());
  //   io.emit("hello", "world", new Date().toTimeString());
  // }, 15000);
});

server.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  await MongoManager.connect();
  await setup();
  console.log('application setup completed');
  // which request, what handler
  app.use('/', (req, res) => {
    console.log(`request received at ${new Date()}`);
    console.log('req', req.body);
    //console.dir(res);
    res.send(`request received at ${new Date()}`);
  });

  console.log('application started', new Date().toTimeString());
});
