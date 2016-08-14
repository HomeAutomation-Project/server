var express = require('express');
var myRouter = express.Router();

module.exports =  myRouter.get('/',function(req,res){
    res.send('We Will Give you info of your all Living Place');
  });

module.exports =  myRouter.get('/house-:hid',function(req,res){
    res.send(req.params.hid);
  });

module.exports =  myRouter.get('/house-:id/room-:rid',function(req,res){
    res.send("house Number: "+req.params.rid+" room Number: "+req.params.id);
  });
