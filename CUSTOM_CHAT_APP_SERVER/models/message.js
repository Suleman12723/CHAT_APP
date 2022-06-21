const mongoose = require('mongoose');



const messageSchema = new mongoose.Schema({
       _id:mongoose.Types.ObjectId,
       message:[new mongoose.Schema({
        sender:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'User'
     },
        reciever:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'User'
     },
        messageText:String,
    },{timestamps:true})]

},{timestamps:true});


module.exports = mongoose.model('Message',messageSchema);