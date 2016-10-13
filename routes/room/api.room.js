var mongoose = require("mongoose");
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var User = require('../../model/User.model.js');
var Room = require('../../model/Room.model.js');
var Place = require('../../model/Place.model.js');
var Switch = require('../../model/Switch.model');
var GPIOSchema = require("../../model/GPIOSchema.model.js");
var usableGPIO = [2,3,4,7,8,9,10,11,14,15,17,18,22,23,24,25,27];
var safe = [4,17,18,22,23,24,25,27];
var unsafe = [2,3,7,8,9,10,11,14,15];

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
         if (err) next(err);
         
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
             if (err) next(err);
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
                  isOf:places._id,
                     PlaceName: places.name,
                  PIR: null,
                  GPIOs : GPIOSchema
                });
                 if(req.body.PIR && (usableGPIO.indexOf(Number(req.body.PIR)))!=-1)
                 {
                     newRoom.PIR=req.body.PIR;
                     newRoom.GPIOs[req.body.PIR] = false;
                 }
                
                // save room object
                newRoom.save(function(err,room) {
                    if (err) next(err);
                places.roomsObjectId.push(mongoose.Types.ObjectId(room._id));
                places.save(function(err,place1)
                {
                    if (err) next(err);
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
         if (err) next(err);
        if(!places)
        {
            var err={};
            err.status = 403;
            err.message='Place Not Found';
            next(err);
        }
        else{
            Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
            function(err, room) {
                if (err) next(err);
                if(req.body.name) {room.name=req.body.name}
                if(req.body.switches) {room.switches=req.body.switches}
                if(req.body.isOf) {room.isOf=req.body.isOf}
                if(req.body.PIR && (usableGPIO.indexOf(Number(req.body.PIR)))!=-1) 
                {
                    if(!room.PIR)
                        room.PIR=req.body.PIR
                    else if(room.GPIOs[req.body.PIR])
                    {
                        room.GPIOs[room.PIR] = true;
                        room.GPIOs[req.body.PIR] = false;
                        room.PIR=req.body.PIR
                    }
                    else
                    {
                        var err1={};
                        err1.status = 500;
                        err1.message = 'Pin Busy';
                        next(err1);
                        return;
                    }
                }
                room.save(function(err,room)
                {
                    if (err) next(err);
                    res.send(room);
                })
            });
        }    
     });
});


module.exports =  myRouter.delete('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name: req.params.place},
     function(err, places) {
         if (err) next(err);
        if(!places)
        {
            var err={};
            err.status = 403;
            err.message='Place Not Found';
            next(err);
        }
        else{
            Room.findOne({name: req.params.room, belongsTo: req.decoded._doc.username, isOf: places._id},
            function(err,room)
            {
                if (err) next(err);
                for (var sw_i = 0; sw_i < room.switches.length; sw_i++) {
                    Switch.findByIdAndRemove(room.switches[sw_i], function (err, sw) {
                        if (err) next(err);
                        if (sw) {
                            console.log(sw.SwitchName + " was removed.")
                        }
                    });
                }
                res.send(room);
                room.remove();
            });
        }
     }
     );
});

module.exports =  myRouter.get('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo": req.decoded._doc.username, name: req.params.place})
        .populate('isOf')
        .exec(
            function (err, places) {
                if (err) next(err);
                if (!places)
                {
                    var err = {};
                    err.status = 403;
                    err.message = 'Place Not Found';
                    next(err);
                }
                else {
                    Room.findOne({name: req.params.room, belongsTo: req.decoded._doc.username, isOf: places._id},
                        function (err, room) {
                            if (err) next(err);
                            if (room) {
                                res.send(room);
                            }
                            else {
                                var err = {};
                                err.status = 404;
                                err.message = "ROOM NOT FOUND";
                                next(err);
                            }
                        });
                }
            }
        );

});