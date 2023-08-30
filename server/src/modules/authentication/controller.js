const { loginValidate, authenticate } = require('./request');
const { generateJwtToken } = require('./utils');
const { setCookie } = require('../../utils/cookie');

const setupRoutes = (app) => {

  app.post('/api/login', async (req, res) => {

    const loginValidationResult = loginValidate(req.body);

    if (!loginValidationResult.error) {
      const { email, password } = req.body;
      const authenticationResult =  await authenticate(email, password);
      
      if(authenticationResult.isAuthenticate){

        const jwtToken = await generateJwtToken({
          _id: authenticationResult.user._id,
          name: authenticationResult.user.name
        });

        return res.status(200).json({
          user: authenticationResult.user,
          accessToken: jwtToken
        });
      }
      else{
        return res.status(401).json({message: authenticationResult.message });
      }

    }
    return res
      .status(400)
      .json({ status:'error', message:loginValidationResult.error });

  });

};


const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
