var mongoose = require("mongoose");
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var User = require('../../model/User.model.js');
var Room = require('../../model/Room.model.js');
var Place = require('../../model/Place.model.js');


/**
 * GET /api/room/:place
*/
module.exports =  myRouter.get('/:place',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place})
    .populate('roomsObjectId')
    .exec(
        function(err, places) {
            if (err) throw err;  
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                res.send(places.roomsObjectId);
            }
    });
});

module.exports =  myRouter.post('/:place',function(req,res,next){
  
     Place.findOne({"belongsTo":req.decoded._doc.username, name: req.params.place},
     function(err, places) {
            if (err) throw err;
         
    if(!places)
    {
        var err={};
        err.status = 403;
        err.message='Place Not Found';
        next(err);
    }
    else{
         
         Room.findOne({name:req.body.name,belongsTo:req.decoded._doc.username,isOf:places._id},
         function(err,room)
         {
             if(err) throw err;
             if(room)
             {
                 err={};
                 err.status = 500;
                 err.message = 'Duplicate Room';
                 next(err);
             }
             else
             {
                //create a room object
                 var newRoom = Room({
                  name: req.body.name,
                  belongsTo: req.decoded._doc.username,
                  isOf:places._id
                });
                // save room object
                newRoom.save(function(err,room) {
                if (err) throw err;
                var r = places.roomsObjectId;
                r.push(mongoose.Types.ObjectId(room._id));
                Place.findOneAndUpdate({"belongsTo":req.decoded._doc.username, name: req.params.place},
                {$set:{roomsObjectId:r}}, function(err,place1)
                {
                    if (err) throw err;
                    res.send({'success':!err,room});
                    console.log('Room created!');
                });
                
                });
             }
         });
     }
    })

});


module.exports =  myRouter.put('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name: req.params.place},
     function(err, places) {
        if (err) throw err;
        if(!places)
        {
            var err={};
            err.status = 403;
            err.message='Place Not Found';
            next(err);
        }
        else{
            var r = {};
            if(req.body.name) {r.name=req.body.name}
            if(req.body.switches) {r.switches=req.body.switches}
            if(req.body.isOf) {r.isOf=req.body.isOf}
            console.log(r);
            Room.findOneAndUpdate({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
            {$set:r},
            function(err, room) {
                 if (err) throw err;
                 console.log("LOG:"+r);
                 res.send(room);
            });
        }    
     });
});


module.exports =  myRouter.delete('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name: req.params.place},
     function(err, places) {
        if (err) throw err;
        if(!places)
        {
            var err={};
            err.status = 403;
            err.message='Place Not Found';
            next(err);
        }
        else{
            Room.findOneAndRemove({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
            function(err,room)
            {
                if(err) throw err;
                res.send(room);
            });
        }
     }
     );
});

module.exports =  myRouter.get('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name: req.params.place},
     function(err, places) {
        if (err) throw err;
        if(!places)
        {
            var err={};
            err.status = 403;
            err.message='Place Not Found';
            next(err);
        }
        else{
            Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
            function(err,room)
            {
                if(err) throw err;
                if(room)
                {res.send(room);}
                else
                {
                    var err = {};
                    err.status=404;
                    err.message="ROOM NOT FOUND";
                    next(err);
                }
            });
        }
     }
     );
});