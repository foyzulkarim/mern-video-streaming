const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } =  require('../db/collections');

// validate required fields of user schema 

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginValidate = (data) => {
  const loginValidationResult = schema.validate(data);
  return loginValidationResult;
};

const authenticate = async (email, password) => {

  const user = await User.findOne({email});

  if(user && (await bcrypt.compare(password, user.password))){
    return {
      isAuthenticate: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }    
  }

  return {
    isAuthenticate: false,
    message: 'Invalid email or password'
  }

}

module.exports = {
    loginValidate,
    authenticate
};
