var express = require('express');
var myRouter = express.Router();
var User = require('../model/User.model.js');
var Room = require('../model/Room.model.js');
var Place = require('../model/Place.model.js');


/******************** / ************************/
module.exports =  myRouter.get('/',function(req,res){
    User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  res.send(users);
  console.log(users);
});
});

module.exports =  myRouter.post('/',function(req,res){
  
      var newUser = User({
      username: req.body.username,
      email: req.body.email,
      name:{
        first: req.body.first,
        last: req.body.last
      },
      password: req.body.password
    });

    // save the user
    newUser.save(function(err) {
      if (err) throw err;
      res.send('Done!');
      console.log('User created!');
    });
    
});

/********************* /house-:hid ************************/
module.exports =  myRouter.get('/house-:hid',function(req,res){
    res.send(req.params.hid);
  });

module.exports =  myRouter.get('/house-:id/room-:rid',function(req,res){
    res.send("house Number: "+req.params.rid+" room Number: "+req.params.id);
  });

