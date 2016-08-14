var config =  require('./config.js')('codeanywhere')
console.log(config)

var port = config.PORT;
var ip = config.IP;
var db = 'mongodb://root:root@ds031975.mlab.com:31975/amanv';

var express  =require('express');
var app =  express();
var morgan = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./model/User.model");


mongoose.connect(db);


app.use(morgan('dev'));
app.use('/api',require('./routes/api'));
app.use(express.static(__dirname+'/public'));


app.listen(port,function(){
  console.log('Listening on '+ip+" : "+port)
});