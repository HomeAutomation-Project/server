var mongoose = require("mongoose");
var Room =  require("./Room.model");
var Place =  require("./Place.model.js");
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
   isOfRoom:{
     type: Schema.Types.ObjectId,
     required : true,
     ref : Room
   },
   isOfPlace:{
     type: Schema.Types.ObjectId,
     required : true,
     ref : Place
   },
   belongsTo: String
},{timestamps:true});

module.exports = mongoose.model('Switch',SwitchSchema);
