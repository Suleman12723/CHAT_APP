var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("./models/user");
var jwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var session = require('express-session');



exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
  return jwt.sign(user, process.env.SECRET_KEY,
  {expiresIn:"10h"});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;


exports.jwtPassport = passport.use(new jwtStrategy(opts,
function(jwt_payload, done){
  // console.log("JWT payload: ",jwt_payload);
  User.findOne({_id:jwt_payload._id}, (err, user)=>{
    if(err){
      return done(err, false);
    }
    else if(user){
      return done(null, user);
    }
    else{
      return done(null, false);
    }
  });

}));

// exports.verifyUser = (req,res,next)=>{
//   if(req.user){
//     return next();
//   }
//   else{
//     var err = new Error('You are not authenticated!');
//     err.statusCode = 403;
//     return next(err);
//   }
// }
exports.verifyUser = passport.authenticate('jwt',{session:false});

