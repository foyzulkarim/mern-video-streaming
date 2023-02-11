const app = require("./app");
const { connect } = require("./modules/db/mongo");

const PORT = 4000;

const setup = async (db) => {
  const { updateSchema } = await require("./modules/models/video/schema");
  await updateSchema(db);
  const { setupRoutes } = await require("./modules/models/video/controller");
  setupRoutes(app);
};

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("a user connected");
  console.dir(socket.id);

  setInterval(() => {
    console.log("sending", new Date().toTimeString());
    io.emit("hello", "world", new Date().toTimeString());
  }, 5000);
});

server.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  const db = await connect("mongodb://localhost:27017");
  await setup(db);
  console.log("application setup completed");
  // which request, what handler
  app.use("/", (req, res) => {
    console.log(`request received at ${new Date()}`);
    console.log("req", req.body);
    //console.dir(res);
    res.send(`request received at ${new Date()}`);
  });

  console.log("application started", new Date().toTimeString());
});
