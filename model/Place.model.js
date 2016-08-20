var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({  
   name:{  
      type:String,
      required:true
   },
   roomsObjectId:[Schema.Types.ObjectId],
  belongsTo:String
},{timestamps:true});

module.exports = mongoose.model('Place',PlaceSchema);
