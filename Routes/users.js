const mongoose= require("mongoose");

const mlp = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/users")


const userModel =mongoose.Schema({
  username:String,
  email:String,
  name:String,
  passport:String,
  profile_photo:String,
  bio:String,
  
  posts:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'post',
  }],
  date:{
    type:Date,
    default:Date.now,
  },
  
  

});

userModel.plugin(mlp);

module.exports =  mongoose.model("user",userModel);




