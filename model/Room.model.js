var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SwitchSchema = new Schema({
  status : {
    type:String,
    required: true
    },
    SwitchName:{
        type: String,
        required : true
    }
},{timestamps:true});

var RoomSchema = new Schema({  
  name:{  
      type:String,
      required:true
   },
   switches:[SwitchSchema],
  belongsTo: String
},{timestamps:true});

module.exports = mongoose.model('Room',RoomSchema);
