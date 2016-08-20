var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router();
var User = require('../model/User.model.js');
var Room = require('../model/Room.model.js');
var Place = require('../model/Place.model.js');


myRouter.use('/user',require('./user/api.user.js'));


/******************** / ****************************/

module.exports =  myRouter.get('/',function(req,res){
   res.send('\\user - to fetch all users and \\user\\username to fetch specific yser details');
});

/********************* /login *************************/

module.exports = myRouter.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
/********************* /logout *************************/  
module.exports = myRouter.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });
  
module.exports = myRouter.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.send({ user: req.user });
  });