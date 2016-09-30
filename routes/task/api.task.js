var express = require('express');
var Switch = require('../../model/Switch.model.js');
var Task  = require("../../model/Task.model.js");

var myRouter = express.Router({mergeParams: true});

myRouter.get('/',function(req,res,next){
    Task.find({'belongsTo':req.decoded._doc.username},
    function(err,tasks)
    {
        if(err) throw err;
        if(!tasks)
        {
            err = {};
            err.status=404;
            err.message='Tasks Not Found'
            next(err);
        }
        else{
            res.send(tasks);
        }
    });
});
myRouter.post('/',function(req,res,next){
    Task.findOne({'belongsTo':req.decoded._doc.username, 'name':req.body.name},
    function(err,existingTask){
        if(err) throw err;
        if(existingTask)
        {
            err = {};
            err.status=400;
            err.message='Existing Task';
            next(err);
        }
        else
        {
            Switch.findById(req.body.switch,
            function(err,mySwitch){
                if(err) throw err;
                if(!mySwitch)
                {
                    var err1 = {};
                    err1.status =404;
                    err1.message = 'Switch Not Found';
                    next(err1);
                }
                else
                {
                    if(mySwitch.belongsTo == req.decoded._doc.username)
                    {
                        var newTask = Task({
                            name:req.body.name,
                            Switch: req.body.switch,
                            status: req.body.status,
                            belongsTo: req.decoded._doc.username,
                            taskTimeDate: req.body.taskTimeDate
                        });
                        
                        newTask.save(function(err,tsk)
                        {
                            if(err) throw err;
                            res.send(tsk);
                        });
                    }
                    else
                    {
                        var err2 = {};
                        err2.status=403;
                        err2.message='Unauthorized Access, Switch Does not belongs to You';
                        next(err2);
                    }
                }
            });
        }
    });
});
myRouter.put('/:name',function(req,res,next){
    Task.findOne({'name':req.params.name, 'belongsTo':req.decoded._doc.username},
    function(err,tsk){
        if(err) throw err;
        if(tsk)
        {
            if(req.body.name) tsk.name = req.body.name;
            if(req.body.status) tsk.status = req.body.status;
            if(req.body.taskTimeDate) tsk.taskTimeDate = req.body.taskTimeDate;
            tsk.save(function(err,updatedTask)
            {
                if(err) throw err;
                res.send(updatedTask);
            });
        }
        else
        {
            var err1 = {};
            err1.status = 404;
            err1.message = 'Task Not Found';
        }
    })
});
//myRouter.delete('/',function(req,res,next){});
myRouter.delete('/:name',function(req,res,next){
    Task.findOneAndRemove({name:req.params.name,belongsTo:req.decoded._doc.username}
    ,function(err,delTsk){
        if(err) throw err;
        else
        {
            if(!delTsk)
            {
                var err1 = {};
                err1.status = 404;
                err1.message = 'Task Not found';
                next(err1);
            }
            else
            {
                res.send({'success':!err,'task':delTsk});
            }
        }
    })
});

module.exports = myRouter;