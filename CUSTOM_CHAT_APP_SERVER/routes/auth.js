var express = require('express');
var router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');
const User = require('../models/user');
var bodyParser = require('body-parser');
const cors = require('./cors');

router.use(bodyParser.json());

//signup
router.post("/signup", cors.corsWithOptions, async (req,res,next)=>{
    User.register(new User({username:req.body.username,email:req.body.email}),req.body.password, async(err,user)=>{
        if(err){
            return next(err);
        }
        if(req.body.photoUrl!=null && req.body.photoUrl !=""){
            user.photoUrl = req.body.photoUrl;
        }
        let token = await authenticate.getToken({_id: user._id});
        user.token = token;
        user.save((err,user)=>{
            if(err){
                return next(err);
            }
            passport.authenticate('local')(req,res,()=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({success:true,user:user});
            });
        })
           
    })
});


//login
router.post("/login", cors.corsWithOptions, passport.authenticate('local'),async (req,res,next)=>{
    var token = authenticate.getToken({_id: req.user._id});
    await User.findByIdAndUpdate(req.user._id,{$set:{token:token}})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(user);
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
  });


module.exports = router;