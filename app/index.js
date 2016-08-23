module.exports = function(type){
  var config =  require('../config/config.js')(type);
  var db = config.DB_URL;
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

  mongoose.connect(db);
  
  passport.use(new Strategy(
  function(username, password, cb) {
    User.findOne({'username':username}, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
    
    
  }));
  
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });



// Use application-level middleware for common functionality, including
// logging, parsing, and session handling

  app.use(morgan('dev'));
  app.use(require('cookie-parser')());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(require('express-session')({ secret: 'TOP SECRET', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api',require('../routes/api')(app));
  app.use('/',require('../routes/index'));
  
  return app;
}