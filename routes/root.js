var myRouter = require('express').Router();

module.exports =  myRouter.post('/',function(req,res){
      console.log(req.body);  
  res.send(req.body);
  });