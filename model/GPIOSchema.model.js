var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var GPIOschema = Schema({
                      '2':{type: Boolean, default:true},
                      '3':{type: Boolean, default:true},
                      '7':{type: Boolean, default:true},
                      '8':{type: Boolean, default:true},
                      '9':{type: Boolean, default:true},
                      '10':{type: Boolean, default:true},
                      '11':{type: Boolean, default:true},
                      '14':{type: Boolean, default:true},
                      '15':{type: Boolean, default:true},
                      '4':{type: Boolean, default:true},
                      '17':{type: Boolean, default:true},
                      '18':{type: Boolean, default:true},
                      '22':{type: Boolean, default:true},
                      '23':{type: Boolean, default:true},
                      '24':{type: Boolean, default:true},
                      '25':{type: Boolean, default:true},
                      '27':{type: Boolean, default:true}
});

module.exports = GPIOschema;