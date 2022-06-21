const express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');
const Message = require('../models/message');
const Chat = require('../models/chat');
const cors = require('./cors');
const pusher = require('../pusher');
const User = require('../models/user');

// const mongoose = require('mongoose');

// const db = mongoose.connection;

// db.once('open',()=>{
//   console.log('DB is connected');

//   const messageCollection = db.collection('messages')
//   const changeStream = messageCollection.watch();

//   changeStream.on('change',(change)=>{
//     if(change.operationType === 'update'){
//         const chatId = change.fullDocument._id;
//         const messageDetails = change.fullDocument.message[change.fullDocument.message.length-1];
//         pusher.trigger('messages','inserted',{
//             chatId:chatId,
//             sender:{
//                 _id:messageDetails.sender
//             },
//             reciever:{
//                 _id:messageDetails.reciever
//             },
//             messageText:messageDetails.messageText,
//             _id:messageDetails._id,
//             createdAt:messageDetails.createdAt
//         }); 
         
//       }
//       else{
//         console.log('Error Triggering Pusher');
//       }
//   })

// })



Message.watch([], { fullDocument: 'updateLookup' })
.on("change",async(change)=>{
//   console.log(change.fullDocument);
  if(change.operationType === 'update'){
    const chatId = change.fullDocument._id;
    const messageDetails = change.fullDocument.message[change.fullDocument.message.length-1];
    let chatType = await Chat.findById(chatId).select('chatType');
    if(chatType.chatType == 'group'){
        await User.findById(messageDetails.sender).select('username photoUrl')
        .then((user)=>{
            pusher.trigger('messages','inserted',{
                chatType:chatType.chatType,
                chatId:chatId,
                sender:{
                    _id:messageDetails.sender,
                    photoUrl:user.photoUrl,
                    username:user.username,
                },
                messageText:messageDetails.messageText,
                _id:messageDetails._id,
                createdAt:messageDetails.createdAt
            }); 
        })

    }else{
        pusher.trigger('messages','inserted',{
            chatType:chatType.chatType,
            chatId:chatId,
            sender:{
                _id:messageDetails.sender
            },
            reciever:{
                _id:messageDetails.reciever
            },
            messageText:messageDetails.messageText,
            _id:messageDetails._id,
            createdAt:messageDetails.createdAt
        }); 
    }
         
  }
  else{
    console.log('Error Triggering Pusher FROM MESSAGES');
  }
});

router.route('/:chatId')
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus(200);
  })
.get(authenticate.verifyUser,async (req,res,next)=>{
    await Chat.findOne({_id:req.params.chatId, members:{$in:[req.user._id]}})
    .then(async(chat)=>{
        if(chat!==null)
        {
            await Message.findById(req.params.chatId)
            .populate('message.sender','username photoUrl')
            .populate('message.reciever','username photoUrl')
            .then((messages)=>{
                res.statusCode =200;
                res.setHeader('Content-Type','application/json');
                if(messages){
                    res.json(messages.message);
                    return ;
                }
                else{
                    res.json('No messages Yet');
                    return ;
                }
            },(err)=>{next(err)})
        }
        else{
            var err = new Error('Either you are not authenticated to get this chat or There is no such chat!');
            err.statausCode = 500;
            return next(err);
        }
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
})
.post(authenticate.verifyUser,async (req,res,next)=>{
    await Chat.findOne({_id:req.params.chatId, members:{$in :[ req.user._id]}})
    .then(async (chat)=>{
        if(chat)
        {
            if(chat.chatType == 'private')
            {
                    let reciever;
                    for(var i =0; i<2; i++ ){
                        if(String(chat.members[i])!== String(req.user._id)){
                            reciever = chat.members[i];
                        }
                    }
                
                    await Message.findByIdAndUpdate(req.params.chatId,{$push:{message:{sender:req.user._id,reciever:reciever,messageText:req.body.messageText}}})
                    .then((message)=>{
                    res.statusCode =200;
                    res.setHeader('Content-Type','application/json');
                    res.json({status:"sent",type:chat.chatType,members:chat.members,message:message})
                },(err)=>{next(err)})
            }
            else{
                await Message.findByIdAndUpdate(req.params.chatId,{$push:{message:{sender:req.user._id,messageText:req.body.messageText}}}).then((message)=>{
                    res.statusCode =200;
                    res.setHeader('Content-Type','application/json');
                    res.json({status:"sent"})
                },(err)=>{next(err)})
            }
        }
        else{
            var err = new Error('Either you are not authenticated to message this chat or There is no such chat!');
            err.statusCode = 500;
            return next(err);
        }
    },(err)=>{next(err)})
    .catch((err)=>{next(err)});
});



module.exports = router;