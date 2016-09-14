var mongoose = require("mongoose");
var Room =  require("Room.model");
var Schema = mongoose.Schema;

var SwitchSchema = new Schema({
  status : {
    type:String,
    required: true
    },
  SwitchName:{
        type: String,
        required : true
    },
  GPIO:{
    type: Number
  },
   isOf:{
     type: Schema.Types.ObjectId,
     required : true,
	
     ref : Room
   }
},{timestamps:true});

module.exports = mongoose.model('Switch',SwitchSchema);
