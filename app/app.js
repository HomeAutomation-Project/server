module.exports = function(type){
  var config =  require('../config/config.js')(type);
  var db = 'mongodb://root:root@ds031975.mlab.com:31975/amanv';

  var express  =require('express');
  var app =  express();
  var morgan = require('morgan');
  var bodyParser = require("body-parser");
  var mongoose = require("mongoose");
  var User = require("../model/User.model");
  app.port = config.PORT;
  app.ip = config.IP;

  mongoose.connect(db);

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  
  app.use(morgan('dev'));
  app.use('/api',require('../routes/api'));
  app.use('/',require('../routes/root'));
  return app;
}