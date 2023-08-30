const jwt = require("jsonwebtoken");
const { User } =  require('../modules/db/collections');

const setCurrentUser = async (req, res, next) => {
  const token = req.headers.authorization ?? '';
  req.user = null;
  
  if (token) {
    await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, async function(err, payLOad){
      if(payLOad){
        req.user = await User.getObjectById(payLOad._id);
      }
    });

  }
  next(); 
};


module.exports = {
    setCurrentUser
}
  
