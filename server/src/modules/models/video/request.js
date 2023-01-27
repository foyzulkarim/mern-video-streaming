const Joi = require("joi");
// validate required fields of videos schema from ./schema.js
const schema = Joi.object().keys({
  _id: Joi.string().optional(),
  title: Joi.string().min(3).max(30).required(),
  fileName: Joi.string().min(3).max(30).required(),
  visibility: Joi.string().min(3).max(30).required(),
  recordingDate: Joi.date().required(),
  videoLink: Joi.string().min(3).max(30).required(),
});

const validate = (data) => {
  const validationResult = schema.validate(data);
  console.log(`validationResult:`, validationResult);
  return validationResult;
};

module.exports = {
  validate,
};
