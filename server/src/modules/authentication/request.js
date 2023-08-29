const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } =  require('../db/collections');

// validate required fields of user schema 

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
});

const loginValidate = (data) => {
  const loginValidationResult = schema.validate(data);
  return loginValidationResult;
};

const authenticate = async (email, password) => {

  const defaultReturn = {
    isAuthenticate: false,
    message: 'wrong email or password'
  }

  const user = await User.findOne({email});
  if (user instanceof Error) {
    return defaultReturn
  }

  const isValidPassword = bcrypt.compare(password, user.password)

  if(isValidPassword){
    return {
      isAuthenticate: true,
      user: {
        name: user.name,
        email: user.email
      }
    }    
  }

  return defaultReturn

}

module.exports = {
    loginValidate,
    authenticate
};
