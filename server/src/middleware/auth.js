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

const loginRequired =  (req, res, next) => {
  
  if(req.user){
    next(); 
  }else{
    return res.status(401).json({message: 'you must login to access this resource' });
  }
  
};


module.exports = {
  setCurrentUser,
  loginRequired
}
  
