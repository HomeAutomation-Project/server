var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var Switch = require('../../model/Switch.model');
var User = require('../../model/User.model.js');
var Room = require('../../model/Room.model.js');
var Place = require('../../model/Place.model.js');

/******************** / ************************/
module.exports =  myRouter.get('/',function(req,res){
    Place.find({"belongsTo":req.decoded._doc.username}, function(err, places) {
  if (err) throw err;  
      res.send(places);
      //console.log(places);
});
});


module.exports =  myRouter.post('/',function(req,res,next){
  
     Place.findOne({"belongsTo":req.decoded._doc.username, name: req.body.name}, function(err, place) {
     if (err) throw err;
     
     if(place)
     {
         var err={};
         err.status = 500;
         err.message='Duplicate Place Name';
         next(err);
     }
     else{
         var newPlace = Place({
          name: req.body.name,
          belongsTo: req.decoded._doc.username
        });
    
        // save the user
        newPlace.save(function(err,place) {
          if (err) throw err;
          else
          res.send({'success':!err,place});
          console.log('User created!');
        });
     }
     
    });

    
});

module.exports =  myRouter.get('/:place',function(req,res){
    Place.find({"belongsTo":req.decoded._doc.username, name:req.params.place}, function(err, places) {
    if (err) throw err;  
      res.send(places);
      console.log(places);
});
});

module.exports =  myRouter.put('/:place',function(req,res){
    Place.findOneAndUpdate({"belongsTo":req.decoded._doc.username, name:req.params.place}
    ,{name:req.body.name}
    ,{new:true}
    , function(err,newPlace){
        if (err) throw err;
        else
        res.send({"Success":true,newPlace});
    });
});

module.exports =  myRouter.delete('/:place',function(req,res){
    Place.findOne({"belongsTo": req.decoded._doc.username, name: req.params.place}
        , function (err, myPlace) {
        if (err) throw err;
        else
        {
            var success = false;
            if (myPlace) {
                for (var pl_i = 0; pl_i < myPlace.roomsObjectId.length; pl_i++) {
                    Room.findById(myPlace.roomsObjectId[pl_i], function (err, room) {
                        if (err) throw err;
                        if (room) {
                            for (var sw_i = 0; sw_i < room.switches.length; sw_i++) {
                                Switch.findByIdAndRemove(room.switches[sw_i], function (err, sw) {
                                    if (err) throw err;
                                    if (sw) {
                                        console.log("Switch " + sw.SwitchName + " was removed.")
                                    }
                                });
                            }
                            room.remove();
                            console.log("Room " + room.name + " was removed.")
                        }
                    });
                }
                myPlace.remove();
                console.log("Place " + myPlace.name + " was Removed");
            }
            res.send({"Success": !err, myPlace});
        }
    });
});

/********************* api/place/user/username/name/ ********************/
/*************************************
 *    Fetch User Places Details     **
 *          Admin only              **
 *************************************
**/
module.exports =  myRouter.get('/user/:username',function(req,res,next){
    if(req.decoded._doc.admin)
    {
        Place.find({belongsTo:req.params.username}, function(err, places) {
          if (err) throw err;
            
            res.send(places);
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

module.exports =  myRouter.get('/user/:username/:name',function(req,res,next){
    if(req.decoded._doc.admin)
    {
        Place.find({belongsTo:req.params.username, 'name':req.params.name}, function(err, places) {
          if (err) throw err;
            
            res.send(places);
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