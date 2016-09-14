var mongoose = require("mongoose");
var Room = require("./Room.model");
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({  
   name:{  
      type:String,
      required:true
   },
   roomsObjectId:[{
      type:Schema.Types.ObjectId,
      ref: 'Room'
   }],
  belongsTo:String
},{timestamps:true});

module.exports = mongoose.model('Place',PlaceSchema);
