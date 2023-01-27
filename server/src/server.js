const app = require("./app");
const { connect } = require("./db");

const PORT = 4000;

const setup = async () => {
  const { setupRoutes } = await require("./student.controller");
  setupRoutes(app);
};

app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  await connect("mongodb://localhost:27017");
  await setup();
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
