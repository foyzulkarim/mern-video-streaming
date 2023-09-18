const Joi = require("joi");
const { User } = require('../../db/collections');


const schema = Joi.object().keys({
  _id: Joi.string().optional(),
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().external(async (email, {message}) => {
    const filter = {
      email : email
    };
    const userCount = await User.count({ filter });
    if (userCount) {
      return message('Email already exist');
    }
  }),
  password: Joi.string().min(4).max(15).required(),

});

const validate = async (data) => {
  try{
    const validationResultValue = await schema.validateAsync(data);
    return {value:validationResultValue};
  }
  catch(err){
    return {error:err}
  }

  
};

module.exports = {
  validate,
};
