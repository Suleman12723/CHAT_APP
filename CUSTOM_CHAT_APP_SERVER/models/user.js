const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');



var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};




const userSchema = new mongoose.Schema({
    username:{
        type:String,
        maxLength:20,
        minlength:3,
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
    },
    chats:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        unique:true
    }],
    token:{
        type:String
    }


},{timestamps:true});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',userSchema);