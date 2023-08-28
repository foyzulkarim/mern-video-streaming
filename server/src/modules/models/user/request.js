const Joi = require("joi");

// validate required fields of user schema 

const schema = Joi.object().keys({
  _id: Joi.string().optional(),
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
});

const validate = (data) => {
  const validationResult = schema.validate(data);
  return validationResult;
};

module.exports = {
  validate,
};
