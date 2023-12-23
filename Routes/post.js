const mongoose = require("mongoose");


const postSchema = mongoose.Schema({
  picture:String,
  
  users:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
  }],
caption:String,
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
  }],
});

module.exports =  mongoose.model("post",postSchema);