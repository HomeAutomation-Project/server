var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Switch = require("./Switch.model.js");
var Place =  require("./Place.model.js");
var RoomSchema = new Schema({  
  name:{  
      type:String,
      required:true
   },
   switches:[{
     type : Schema.Types.ObjectId,
     ref : 'Switch'
   }],
  belongsTo: String,
  isOf:{
    type: Schema.Types.ObjectId,
    ref:'Place'
  },
  PIR:{
    type:Number
  }
},{timestamps:true});

module.exports = mongoose.model('Room',RoomSchema);
