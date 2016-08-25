var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router();
var jwt    = require('jsonwebtoken');
var User = require('../model/User.model.js');
var Room = require('../model/Room.model.js');
var Place = require('../model/Place.model.js');

module.exports= function(app){
  
  var secret = app.get('secret');
  
  
  
  /******************** / ****************************/
  
  myRouter.get('/',function(req,res){
     res.send('/user - to fetch all users and /user/username to fetch specific yser details');
  });
  
  /********************* /authenticate *************************/
  
  myRouter.post('/authenticate', function(req, res) {
      
        // find the user
        User.findOne({
          username: req.body.username
        }, function(err, user) {
      
          if (err) throw err;
      
          if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
          } else if (user) {
      
            // check if password matches
            if (user.password != req.body.password) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
      
              // if user is found and password is right
              // create a token
              var token = jwt.sign(user, secret);
      
              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
            }   
      
          }
      
        });
      });
  
      
    /**
     * Middleware to verify token
     *
     */
    
  myRouter.use(function(req, res, next) {
    
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      // decode token
      if (token) {
    
        // verifies secret and checks exp
        jwt.verify(token, secret, function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
        
      }
    });
  
      
  /********************* /logout ************************  
  myRouter.get('/logout',
    function(req, res){
      req.logout();
      res.redirect('/');
    });
  */  
  myRouter.get('/profile',
    //require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.send({ user: req.decoded });
    });
    
  myRouter.use('/user',require('./user/api.user.js'));
  
  return myRouter;

}