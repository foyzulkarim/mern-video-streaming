const multer = require('multer');
const { insert, update } = require('./service');

const BASE_URL = `/api/roles`;

const setupRoutes = (app) => {
  console.log(`Setting up routes for ${BASE_URL}`);

  app.post(`${BASE_URL}/create`, async (req, res) => {
    console.log('rolecreate create', req.body);
    const result = await insert(req.body);
    if (result instanceof Error) {
      res.status(400).json(JSON.parse(result.message));
      return;
    }
    return res.json(result);
  });

  app.put(`${BASE_URL}/update`, async (req, res) => {
    const result = await update(req.body);
    if (result instanceof Error) {
      res.status(400).json(JSON.parse(result.message));
      return;
    }
    return res.json(result);
  });
};

const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
