var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
   password:{  
      type:String,
      required:true
   }
},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);
