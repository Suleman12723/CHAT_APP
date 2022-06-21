var express = require('express');
var router = express.Router();
const authenticate = require('../authenticate');
const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const cors = require('./cors');
const pusher = require('../pusher');
const mongoose = require('mongoose');


/* All chats*/
router.route('/')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('GET operation is not supported on /chat');

})
.post(authenticate.verifyUser,async (req,res,next)=>{
  if(req.body.chatType === 'private'){
     await Chat.create({
      createdBy:req.user._id,
      members:[req.user._id, req.body.chatWith],
      chatType:req.body.chatType
    }).then(async(chat) => {
      await Message.create({
        _id:chat._id
      }).then(async ()=>{
        await User.updateMany({$or:[{_id:req.user._id},{_id:req.body.chatWith}]},{$push:{chats:chat._id}})
        .then(()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({chat:chat});
          return ;
        },(err)=>{next(err)})
      },(err)=>{next(err)})
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
  }
  else{
    await Chat.create({
      chatName:req.body.chatName,
      createdBy:req.user._id,
      members:[req.user._id,...req.body.members],
      chatType:req.body.chatType
    }).then(async(chat) => {
      await Message.create({
        _id:chat._id
      }).then(async ()=>{
        await User.findByIdAndUpdate(req.user._id,{$push:{chats:chat._id}})
        .then(()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({chat:chat});
          return ;
        },(err)=>{next(err)})
      },(err)=>{next(err)})
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
  }
  
})
.put(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /groups');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('DELETE operation is not supported on /groups');
});


/* Specific Chat */
router.route('/:Recieverid')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser, (req,res,next)=>{
  const objId = mongoose.Types.ObjectId(req.params.Recieverid);
  Chat.find({chatType:'private', members:{$in:[objId]}})
  .then(async(chats)=>{
    if(chats){
      const chat = await chats.filter(chat=> chat.members.includes(req.user._id));
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      if(chat.length>0){
        let username = await User.findById(req.params.Recieverid).select('username');
        res.json({found:true,chatName:username.username,chatId:chat._id})
        return ;      
      }
      else{
        res.json({found:false})
        return ;
      } 
    }
    else{
      res.json({found:false})
      return ;
    }
  },(err)=>{next(err)})
  .catch((err)=>{next(err)});

})
.post(authenticate.verifyUser,async (req,res,next)=>{
  res.statusCode = 403;
  res.end('POST operation is not supported on /chat/id');
  

})
.put(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /chat/id');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('DELETE operation is not supported on /chat/id');
});


/* Check group with same name exsists */
router.route('/group/:groupname')
.options(cors.corsWithOptions, (req,res)=>{
  res.sendStatus(200);
})
.get(authenticate.verifyUser,(req,res,next)=>{
  Chat.findOne({chatType:'group',chatName:req.params.groupname,members:{$in:[req.user._id]}})
  .then((chat)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    if(chat){
      res.json({found:true});
    }
    else{
      res.json({found:false});
    }
  },(err)=>{next(err)})
  .catch((err)=>{next(err)});
})


router.route('/group/:id')
.options(cors.corsWithOptions,(req,res)=>{
  res.sendStatus(200);
})
.post(authenticate.verifyUser,(req,res,next)=>{
  Chat.findById(req.params.id)
  .then((chat)=>{
    if(chat){
      var exsistingMembers = chat.members;
      var reqMembers = req.body.members;
      var addMembers = reqMembers.filter(member => exsistingMembers.indexOf(member) === -1);
      chat.members.push(...addMembers);
      chat.save()
      .then(async(r)=>{
        await User.find({_id:{$in:addMembers}})
        .then((users)=>{
          if(users.length>0){
            for(var i =0; i<users.length; i++){
              users[i].chats.push(req.params.id);
              users[i].save();
            }
          }
        })
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true});
        return ;
      },(err)=>{next(err)})
    }
    else{
      res.statusCode(404);
      res.setHeader('Content-Type','application/json');
      res.json({success:false});
      return ;
    }
  },(err)=>{next(err)})
  .catch((err)=>{next(err)});
});






module.exports = router;
