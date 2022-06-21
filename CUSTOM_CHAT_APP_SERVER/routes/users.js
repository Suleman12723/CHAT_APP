var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate');
const User = require('../models/user');
const Chat = require('../models/chat');
const cors = require('./cors');
const pusher = require('../pusher');
// const mongoose = require('mongoose');

// const db = mongoose.connection;

// db.once('open',()=>{
//   console.log('DB is connected');

//   const userCollection = db.collection('users')
//   const changeStream = userCollection.watch();

//   changeStream.on('change',(change)=>{
//     console.log(change);
//   })

// })

User.watch()
.on("change",change=>{
  if(change.operationType=='update'){
    pusher.trigger('userUpdated','inserted',{
      _id:change.documentKey._id
    });
  }
  else{
    console.log('Error Triggering Pusher FROM USER')
  }

})





/* All Users(Contacts Avialable) */
router.route('/')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser,async (req,res,next)=>{

  User.find({_id:{ $ne: req.user._id }}).then((users)=>{
    if(users){
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(users);
      return ;
    }
    else{
      var err = new Error('No users found!');
      err.statusCode = 500;
      return next(err);
    }
    
  },(err)=>{next(err)})
  .catch((err)=>{next(err)})

})
.post(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('POST operation is not supported on /users');

})
.put(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /users');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('DELETE operation is not supported on /users');
});


/* users details*/
router.route('/:id')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser,(req,res,next)=>{
  if(String(req.user._id) == String(req.params.id)){
    User.findById(req.params.id).then((user)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({user:user});
      return ;
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
  }
  else{
    var err = new Error('You are not autheorized to perform this opeartion!');
    err.statusCode = 403;
    return next(err);
  }
})
.post(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('POST operation is not supported on /users/'+req.params.id);

})
.put(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /users/'+req.params.id);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('DELETE operation is not supported on /users/'+req.params.id);
});


/* handle your chats */
router.route('/:id/chats')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser,(req,res,next)=>{
  if(String(req.user._id) == String(req.params.id)){
    User.findById(req.params.id).select('chats')
    .populate('chats')
    .lean()
    .then(async(chats)=>{
      if(chats){
        let updatedChats = chats.chats;
        let sendChats = [];
        for(var i=0 ; i<updatedChats.length; i++){
          if(updatedChats[i].chatType=='private'){
            let showId;
            if(String(updatedChats[i].members[0]._id) != String(req.user._id)){
              showId = updatedChats[i].members[0]._id;
            }
            else{
              showId = updatedChats[i].members[1]._id;
            }
            let username = await User.findById(showId).select('username photoUrl');
            let tempObj = {...updatedChats[i],chatName:username.username,photoUrl:username.photoUrl};

            sendChats.push(tempObj);
          }
          else{
            sendChats.push(updatedChats[i]);
          }
        }
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({chats:sendChats});
            return ;
        
      }
      else{
        var err= new Error('No contacts found!');
        err.statusCode = 500;
        return next(err);
      }
      
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
  }
  else{
        var err= new Error('You are not authorized!');
        err.statusCode = 500;
        return next(err);
  }
})
.post(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('POST operation is not supported on /users/'+req.params.id);
})
.put(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /users/'+req.params.id);
  // if(req.user._id === req.params.id){
  //   User.findById(req.params.id)
  //   .then((user)=>{
  //     let userData = user;
      
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type','application/json');
  //     res.json({contacts:contacts});
  //     return ;
  //   },(err)=>{next(err)})
  //   .catch((err)=>{next(err)});
  // }
  // else{
  //   var err = new Error('You are not authenticated to perform this operation!');
  //   err.statusCode = 503;
  //   return next(err);
  // }
  
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('DELETE operation is not supported on /users/'+req.params.id);
  // if(req.user._id === req.params.id){
  //   User.findByIdAndUpdate(req.params.id,{$pullAll:{contacts:[{_id:req.body.id}]}})
  //   .then((contacts)=>{
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type','application/json');
  //     res.json({contacts:contacts});
  //     return ;
  //   },(err)=>{next(err)})
  //   .catch((err)=>{next(err)});
  // }
  // else{
  //   var err = new Error('You are not authenticated to perform this operation!');
  //   err.statusCode = 503;
  //   return next(err);
  // }
});



module.exports = router;
