var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Switch = require("./Switch.model.js");

var TaskSchema = new Schema({  
  name:{  
      type:String,
      required:true
   },
   Switch:{
     type : Schema.Types.ObjectId,
     ref : 'Switch'
   },
   status:{
       type: String,
       required: true
   },
  belongsTo: String,
  taskTimeDate:{
      type: String,
      required: true
  }
},{timestamps:true});

module.exports = mongoose.model('Task',TaskSchema);