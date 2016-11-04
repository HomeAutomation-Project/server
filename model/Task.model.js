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
    SName: {
        type: String
    },
   status:{
       type: String,
       required: true
   },
  belongsTo: String,
  taskTimeDate:{
      type: String,
      required: true
  },
    repeat: {
        type: Boolean,
        default: false
    },
    Repeat: {
        type: String,
        default: 'hourly'
    },
    Completed: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

module.exports = mongoose.model('Task',TaskSchema);