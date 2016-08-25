var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new Schema({  
  username:{  
      type:String,
      required:true,
      unique:true
   },
   email:{  
      type:String,
      required:true,
      unique:true
   },
   name:{  
      first:{  
         type:String,
         required:true
      },
      last:{  
         type:String,
         required:true
      }
   },
   admin:{
      type:Boolean,
      default:false
   }
},{timestamps:true});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);
