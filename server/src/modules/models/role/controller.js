const logger = require('../../../logger');
const { insert, update,  getById } = require('./service');

const BASE_URL = `/api/roles`;

const setupRoutes = (app) => {
  logger.info(`Setting up routes for ${BASE_URL}`);

  app.post(`${BASE_URL}/create`, async (req, res) => {
    logger.info('rolecreate create', req.body);
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

  app.get(`${BASE_URL}/detail/:id`, async (req, res) => {
    logger.info(`GET`, req.params);
    const item = await getById(req.params.id);
    if (item instanceof Error) {
      return res.status(400).json(JSON.parse(item.message));
    }
    res.send(item);
  });
};

const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
