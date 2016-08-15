var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({  
   name:{  
      type:String,
      required:true
   },
   rooms:[ObjectId],
  belongsTo: ObjectId
},{timestamps:true});

module.exports = mongoose.model('Place',PlaceSchema);
