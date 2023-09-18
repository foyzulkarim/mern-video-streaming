const jwt = require("jsonwebtoken");

const generateJwtToken = async ( payload) => {
  const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });
  return jwtToken
};

module.exports = {
    generateJwtToken
}