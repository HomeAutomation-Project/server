var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var User = require('../model/User.model.js');
var Room = require('../model/Room.model.js');
var Place = require('../model/Place.model.js');
var Verify = require("../verify.js");
var jwt    = require('jsonwebtoken');



module.exports= function(app){
  
//var secret = app.get('secret');
  
  
  
  /******************** / ****************************/
  
  myRouter.get('/',function(req,res){
     res.send('/user - to fetch all users and /user/username to fetch specific yser details');
  });
  
  /******************** /register ****************************/
  myRouter.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username,
                             "name":{first:req.body.first,last:req.body.last },
                             email:req.body.email
        
    }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
});
  
  /********************* /authenticate *************************/
  
  myRouter.post('/authenticate', function(req, res,next) {
      passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

myRouter.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});
  

  myRouter.get('/profile',Verify.verifyOrdinaryUser,
    //require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.send({ user: req.decoded });
    });
  
  myRouter.use('/user',Verify.verifyOrdinaryUser);  
  myRouter.use('/user',require('./user/api.user.js'));
  
  myRouter.use('/place',Verify.verifyOrdinaryUser);  
  myRouter.use('/place',require('./place/api.place.js'));
  
  return myRouter;

}
