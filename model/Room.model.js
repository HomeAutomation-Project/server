var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Switch = require("./Switch.model.js");
var Place =  require("./Place.model.js");
var GPIOSchema = require("./GPIOSchema.model.js");
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
    PlaceName: {
        type: String,
        required: true
    },
  PIR:{
    type:Number
  },
  GPIOs:GPIOSchema
},{timestamps:true});

module.exports = mongoose.model('Room',RoomSchema);
