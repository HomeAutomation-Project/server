var mongoose = require("mongoose");
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var myRouter = express.Router(express.Router({mergeParams: true}));
var User = require('../../model/User.model.js');
var Room = require('../../model/Room.model.js');
var Place = require('../../model/Place.model.js');
var Switch = require('../../model/Switch.model.js');


module.exports =  myRouter.get('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place},
    function(err, places) {
            if (err) throw err;  
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
                function(err,room)
                {
                   if(err)  throw err;
                   if(!room)
                   {
                       var err = {};
                       err.status = 404;
                       err.message = 'Room Not Found';
                       next(err);
                   }
                   else
                   {
                       Switch.find({isOfPlace:places._id,isOfRoom:room._id,belongsTo:req.decoded._doc.username},
                       function(err,sw){
                           if(err)
                           {throw err;}
                           else
                           {
                               if(sw.length!==0)
                               {
                                   res.send(sw);
                               }
                               else
                               {
                                   var err = {};
                                   err.status = 404;
                                   err.message = 'No Switch Found!';
                                   next(err);
                               }
                           }
                       });
                   }
                   
                });
            }
    });
});

module.exports =  myRouter.get('/:place/:room/:switch',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place},
    function(err, places) {
            if (err) throw err;  
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id},
                function(err,room)
                {
                   if(err)  throw err;
                   if(!room)
                   {
                       var err = {};
                       err.status = 404;
                       err.message = 'Room Not Found';
                       next(err);
                   }
                   else
                   {
                       Switch.findOne({SwitchName:req.params.switch,isOfPlace:places._id,isOfRoom:room._id,belongsTo:req.decoded._doc.username},
                       function(err,sw){
                           if(err)
                           {throw err;}
                           else
                           {
                               if(sw)
                               {
                                   res.send(sw);
                               }
                               else
                               {
                                   var err = {};
                                   err.status = 404;
                                   err.message = 'Switch Not Found!';
                                   next(err);
                               }
                           }
                       });
                   }
                   
                });
            }
    });
});

module.exports = myRouter.get('/:place/:room/:switch/ON', function (req, res, next) {
    Place.findOne({"belongsTo": req.decoded._doc.username, name: req.params.place},
        function (err, places) {
            if (err) throw err;
            if (!places) {
                err = {};
                err.status = 404;
                err.message = 'Place Not Found'
                next(err);
            }
            else {
                Room.findOne({name: req.params.room, belongsTo: req.decoded._doc.username, isOf: places._id})
                    .exec(
                        function (err, room) {
                            if (err)  throw err;
                            if (!room) {
                                var err = {};
                                err.status = 404;
                                err.message = 'Room Not Found';
                                next(err);
                                return;
                            }
                            Switch.findOneAndUpdate({
                                    SwitchName: req.params.switch,
                                    isOfPlace: places._id,
                                    isOfRoom: room._id,
                                    belongsTo: req.decoded._doc.username
                                },
                                {$set: {status: 'ON'}},
                                function (err, sw) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        if (sw) {
                                            res.send(sw);
                                        }
                                        else {
                                            var err = {};
                                            err.status = 404;
                                            err.message = 'Switch Not Found!';
                                            next(err);
                                        }
                                    }
                                });
                        }
                    );

            }
        }
    );
});
module.exports = myRouter.get('/:place/:room/:switch/OFF', function (req, res, next) {
    Place.findOne({"belongsTo": req.decoded._doc.username, name: req.params.place},
        function (err, places) {
            if (err) throw err;
            if (!places) {
                err = {};
                err.status = 404;
                err.message = 'Place Not Found'
                next(err);
            }
            else {
                Room.findOne({name: req.params.room, belongsTo: req.decoded._doc.username, isOf: places._id})
                    .exec(
                        function (err, room) {
                            if (err)  throw err;
                            if (!room) {
                                var err = {};
                                err.status = 404;
                                err.message = 'Room Not Found';
                                next(err);
                                return;
                            }
                            Switch.findOneAndUpdate({
                                    SwitchName: req.params.switch,
                                    isOfPlace: places._id,
                                    isOfRoom: room._id,
                                    belongsTo: req.decoded._doc.username
                                },
                                {$set: {status: 'OFF'}},
                                function (err, sw) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        if (sw) {
                                            res.send(sw);
                                        }
                                        else {
                                            var err = {};
                                            err.status = 404;
                                            err.message = 'Switch Not Found!';
                                            next(err);
                                        }
                                    }
                                });
                        }
                    );

            }
        }
    );
});
module.exports = myRouter.get('/:place/:room/:switch/PIR', function (req, res, next) {
    Place.findOne({"belongsTo": req.decoded._doc.username, name: req.params.place},
        function (err, places) {
            if (err) throw err;
            if (!places) {
                err = {};
                err.status = 404;
                err.message = 'Place Not Found'
                next(err);
            }
            else {
                Room.findOne({name: req.params.room, belongsTo: req.decoded._doc.username, isOf: places._id})
                    .exec(
                        function (err, room) {
                            if (err)  throw err;
                            if (!room) {
                                var err = {};
                                err.status = 404;
                                err.message = 'Room Not Found';
                                next(err);
                                return;
                            }
                            Switch.findOneAndUpdate({
                                    SwitchName: req.params.switch,
                                    isOfPlace: places._id,
                                    isOfRoom: room._id,
                                    belongsTo: req.decoded._doc.username
                                },
                                {$set: {status: 'PIR'}},
                                function (err, sw) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        if (sw) {
                                            res.send(sw);
                                        }
                                        else {
                                            var err = {};
                                            err.status = 404;
                                            err.message = 'Switch Not Found!';
                                            next(err);
                                        }
                                    }
                                });
                        }
                    );

            }
        }
    );
});

module.exports =  myRouter.post('/:place/:room',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place},
    function(err, places) {
        if (err) next(err);
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id})
                    .populate('switches')
                    .exec(
                function(err,room)
                {
                    if (err)  next(err);
                   if(!room)
                   {
                       var err = {};
                       err.status = 404;
                       err.message = 'Room Not Found';
                       next(err);
                   }
                   else
                   {
                       Switch.findOne({SwitchName:req.body.SwitchName||req.body.name,isOfPlace:places._id,isOfRoom:room._id,belongsTo:req.decoded._doc.username},
                       function(err,sw){
                           if(err) {
                               next(err);
                           }
                           else
                           {
                               if(sw)
                               {
                                   var err = {};
                                   err.status = 404;
                                   err.message = 'Duplicate Switch Name!';
                                   next(err);
                               }
                               else
                               {
                                   var sent = false;
                                   console.log(room.GPIOs);
                                   if(req.body.GPIO && room.GPIOs[req.body.GPIO]==false)
                                   {
                                       
                                       err={};
                                       err.status = 500;
                                       err.message = 'Switch Busy ';
                                       sent = true;
                                       next(err);
                                   
                                   }
                               
                                   else
                                   {
                                       var newSwitch = Switch({
                                       status : req.body.status||'OFF',
                                       SwitchName: req.body.name||req.body.SwitchName,
                                       GPIO: req.body.GPIO,
                                       isOfPlace:mongoose.Types.ObjectId(places._id),
                                       isOfRoom: mongoose.Types.ObjectId(room._id),
                                       belongsTo:req.decoded._doc.username
                                   });
                                   newSwitch.save(function(err,sw) {
                                       if (err) next(err);
                                       
                                       Room.findById(sw.isOfRoom,function(err,rm){
                                           if (err) next(err);
                                           console.log(sw);
                                           rm.switches.push(sw._id);
                                           rm.GPIOs[req.body.GPIO] = false;
                                           rm.save(function(err,data)
                                           {
                                               if (err) next(err);
                                               console.log(data);
                                           });
                                       });
                                       res.send(sw);
                                   });
                                   }
                               }
                           }
                       });
                   }
                   
                }
                        );
            }
    });
});


module.exports =  myRouter.put('/:place/:room/:switch',function(req,res,next){
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place},
    function(err, places) {
        if (err) next(err);
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id})
                .populate('switches')
                .exec(
                    function(err,room)
                {
                    if (err)  next(err);
                   if(!room)
                   {
                       var err = {};
                       err.status = 404;
                       err.message = 'Room Not Found';
                       next(err);
                   }
                   else
                   {
                       for(var i=0;i<room.switches.length;i++)
                                if(room.switches[i].SwitchName === req.params.switch)
                                    var x= room.switches[i].GPIO;
                       var r ={};
                       if(req.body.GPIO) {
                           if(req.body.GPIO && req.body.GPIO ==x)
                           {}
                           else if(room.GPIOs[req.body.GPIO])
                           {
                               r.GPIO=req.body.GPIO;
                               room.GPIOs[req.body.GPIO]=false;
                                console.log(room.GPIOs);
                               room.GPIOs[x]=true;
                               console.log(room.GPIOs);
                           }
                           else{
                               err={};
                               err.status = 500;
                               err.message = 'GPIO Pin Busy';
                               next(err);
                               return ;
                           }
                       }
                       if(req.body.SwitchName || req.body.name) {r.SwitchName=req.body.SwitchName || req.body.name}
                       if(req.body.isOfRoom) {r.isOfRoom=req.body.isOfRoom}
                       if(req.body.isOfPlace) {r.GPIO=req.body.isOfPlace}
                       if(req.body.status) {r.status=req.body.status}
                       Switch.findOneAndUpdate({SwitchName:req.params.switch,isOfPlace:places._id,isOfRoom:room._id,belongsTo:req.decoded._doc.username},
                       {$set:r},
                       function(err,sw){
                           if(err) {
                               next(err);
                           }
                           else
                           {
                               if(sw)
                               {
                                   res.send(sw);
                               }
                               else
                               {
                                   var err = {};
                                   err.status = 404;
                                   err.message = 'Switch Not Found!';
                                   next(err);
                               }
                           }
                       });
                   }
                   
                }
                    );
                
            }
    }
    );
});


module.exports =  myRouter.delete('/:place/:room/:switch',
function(req,res,next)
{
    Place.findOne({"belongsTo":req.decoded._doc.username, name:req.params.place},
    function(err, places) {
        if (err) next(err);
            if(!places)
            {
                err = {};
                err.status=404;
                err.message='Place Not Found'
                next(err);
            }else{
                Room.findOne({name:req.params.room,belongsTo:req.decoded._doc.username,isOf:places._id})
                .exec(
                function(err,room)
                {
                    if (err)  next(err);
                   if(!room)
                   {
                       var err = {};
                       err.status = 404;
                       err.message = 'Room Not Found';
                       next(err);
                   }
                   else
                   {
                       Switch.findOneAndRemove({SwitchName:req.params.switch,isOfRoom:room._id,isOfPlace:places._id,belongsTo:req.decoded._doc.username}
                       ,function(err,sw)
                       {
                           if (err) next(err);
                           room.switches.splice(room.switches.indexOf(sw._id),1);
                           room.GPIOs[sw.GPIO]=true;
                           room.save();
                           res.send({success:!err,sw});
                       });
                   }
                });
            }
    });
}

);