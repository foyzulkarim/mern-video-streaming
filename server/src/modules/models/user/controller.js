const { User } = require('../../db/collections');
const { validate } = require('./request');

const BASE_URL = `/api/user`;

const setupRoutes = (app) => {


  app.post(`${BASE_URL}/registration`, async (req, res) => {

    const validationResult = validate(req.body);

    if (!validationResult.error) {
      const result = await User.insert({isActive:true, ...validationResult.value});
      if (result instanceof Error) {
        return res.status(400).json(result.message);
      }
      return res.status(201).json(result);
    }
    return res
      .status(400)
      .json({ status: 'error', message: validationResult.error });

  });


};


const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
