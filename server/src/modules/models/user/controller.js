const { User } = require('../../db/collections');
const { validate } = require('./request');
const bcrypt = require('bcrypt')

const BASE_URL = `/api/user`;

const setupRoutes = (app) => {


  app.post(`/api/registration`, async (req, res) => {

    const validationResult = await validate(req.body);

    if (!validationResult.error) {
      const hashPassword = await bcrypt.hash(req.body.password, 10)
      const result = await User.insert({
        isActive:true, 
        ...validationResult.value,
        password: hashPassword
      });
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
