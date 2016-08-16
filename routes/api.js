var express = require('express');
var myRouter = express.Router();
var User = require('../model/User.model.js');
var Room = require('../model/Room.model.js');
var Place = require('../model/Place.model.js');

/******************** / ****************************/

module.exports =  myRouter.get('/',function(req,res){
   res.send('\\user - to fetch all users and \\user\\username to fetch specific yser details');
});


/******************** /user ************************/
module.exports =  myRouter.get('/user',function(req,res){
    User.find({}, function(err, users) {
  if (err) throw err;  
      res.send(users);
      
      console.log(users);
});
});

module.exports =  myRouter.post('/user',function(req,res){
  
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

/********************* /user/username *********************/

module.exports =  myRouter.get('/user/:username',function(req,res){
    User.find({'username':req.params.username}, function(err, users) {
  if (err) throw err;
  
  
      var temp ={userdetails:null, placedetails:null};
      temp.userdetails=JSON.parse(JSON.stringify(users[0]));
      Place.find({belongsTo:temp.userdetails.username}, function(err, places) {
        console.log("Places:", places[0]);
        if(places[0])
        temp.placedetails=JSON.parse(JSON.stringify(places[0]));
        console.log("added to temp",temp)
      if (err) throw err;
        
        res.send(temp);
        console.log(temp);      
      });
  // object of all the users
  
});
});

module.exports =  myRouter.put('/user/:username',function(req,res){
  
  User.findOneAndUpdate({ 'username': req.body.username },
                        { 
                        username: req.body.username,
                        email: req.body.email,
                        name:{
                          first: req.body.first,
                          last: req.body.last
                        },
                        password: req.body.password
                        },
                        function(err, user) {
                        if (err) throw err;
                        console.log(user);
  });    
});

module.exports =  myRouter.post('/user/add',function(req,res){
  
   var newPlace = Place({
      name: req.body.name,
      rooms: [req.body.name],
      belongsTo: req.body.username
    });

    // save the user
    newPlace.save(function(err) {
      if (err) throw err;
      res.send('Done!');
      console.log('User created!');
    }); 
});
/********************* /user/username/name/ ********************/

module.exports =  myRouter.get('/user/:username/:name',function(req,res){
    User.find({'username':req.params.username}, function(err, users) {
  if (err) throw err;

  // object of all the users
  res.send(users);
  console.log(users);
});
});



