const jwt = require("jsonwebtoken");
const { User } =  require('../modules/db/collections');

const { removeCookie } = require('../utils/cookie')

const setCurrentUser = async (req, res, next) => {
  const token = req.cookies.Bearer ?? '';
  req.user = null;
  
  if (token) {
    await jwt.verify(token, process.env.JWT_SECRET, async function(err, payLOad){
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
    removeCookie(res, 'Bearer')
    return res.status(401).json({message: 'you must login to access this resource' });
  }
  
};


module.exports = {
  setCurrentUser,
  loginRequired
}
  
