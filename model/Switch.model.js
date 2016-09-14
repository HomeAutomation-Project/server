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
    },
  GPIO:{
    type: Number
  }
},{timestamps:true});

module.exports = mongoose.model('Switch',SwitchSchema);
