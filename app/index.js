module.exports = function(type){
  var config =  require('../config/config.js')(type);
  var passport = require('passport');
  var Strategy = require('passport-local').Strategy;
  var express  =require('express');
  var app =  express();
  var morgan = require('morgan');
  var bodyParser = require("body-parser");
  var mongoose = require("mongoose");
  var User = require("../model/User.model");
  var Room = require('../model/Room.model.js');
  var Place = require('../model/Place.model.js');

  app.set('port',config.PORT) ;
  app.set('ip',config.IP);
  app.set('secret',config.secret);
  app.set('db',config.DB_URL);
  
  mongoose.connect(app.get('db'));
  
  passport.use(new Strategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

 

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling

  app.use(morgan('dev'));
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});
  app.use(require('cookie-parser')());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  //app.use(require('express-session')({ secret: app.get('secret'), resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api',require('../routes/api')(app));
  app.use('/',require('../routes/index'));
  app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});
  
  return app;
}
