var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var User = require('../../model/User.model.js');
var Room = require('../../model/Room.model.js');
var Place = require('../../model/Place.model.js');



/******************** api/user/ ************************/
module.exports =  myRouter.get('/',function(req,res){
    User.findOne({'username':req.decoded._doc.username}, function(err, users) {
  if (err) throw err;  
      res.send(users);
      
      console.log(users);
});
});

/*************************************
 *        Create a new user         **
 *          Admin only              **
 *************************************
**/

module.exports =  myRouter.post('/',function(req,res,next){
  
     if(req.decoded._doc.admin)
     {
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
     }
else{
 var err= {};
        err.status = 403;
        err.message =  'Not Admin';
        next(err);
}
    
});

/********************* api/user/username *********************/
/**************************************
  *        Fetch User Details        **
  *          Admin only              **
  *************************************
 **/

module.exports =  myRouter.get('/:username',function(req,res,next){
  
  if(req.decoded._doc.admin)
  {
  var temp ={userdetails:null, placedetails:null};
    User.findOne({'username':req.params.username}, function(err, users) {
      if (err) throw err;
  
      temp.userdetails=JSON.parse(JSON.stringify(users));
      if(temp.userdetails){
        
      Place.find({belongsTo:temp.userdetails.username}, function(err, places) {
        console.log("Places:", places);
        if(places)
        temp.placedetails=JSON.parse(JSON.stringify(places));
        console.log("added to temp",temp)
      if (err) throw err;
        
        console.log(temp);  
        res.send(temp);
      });
      }
    });
  }
  else
  {
    var err= {};
        err.status = 403;
        err.message =  'Not Admin';
        next(err);
  }
 
});

module.exports =  myRouter.put('/:username',function(req,res,next){
  if(req.decoded._doc.admin)
  {
    User.findOneAndUpdate({ 'username': req.body.params.username },
                        { 
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
  }
  else
  {
    var err= {};
        err.status = 403;
        err.message =  'Not Admin';
        next(err);
  }
});

module.exports =  myRouter.put('/',function(req,res){
  
    User.findOneAndUpdate({ 'username': req.decoded._doc.username },
                        { 
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

module.exports =  myRouter.post('/add',function(req,res){
  
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





