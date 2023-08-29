const { loginValidate, authenticate } = require('./request');


const setupRoutes = (app) => {

  app.post('/api/login', async (req, res) => {

    const loginValidationResult = loginValidate(req.body);

    if (!loginValidationResult.error) {
      const { email, password } = req.body
      const authenticationResult =  await authenticate(email, password)
      if(authenticationResult.isAuthenticate){
        return res
        .status(200)
        .json({user: authenticationResult.user });
      }
      else{
        return res
        .status(401)
        .json({message: authenticationResult.message });
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
