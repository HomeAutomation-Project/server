var moment = require('moment');
var app = require('./app/index.js')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Task = require('./model/Task.model');
var Switch = require('./model/Switch.model');
app.use(require('express').static(__dirname+'/public'));


server.listen(app.get('port'),function(){
  console.log('Listening on '+app.get('ip')+" : "+app.get('port'))
});


var t = setInterval(function(){
    Task.find({},function(err,allTasks){
        if(err) throw err;
        else
        {
            if(allTasks.length>0)
            {
                for(var k=0; k<allTasks.length; k++)
                {
                    console.log("k="+k+" compare val="+allTasks.length);
                    var d1 = new Date().toUTCString();
                    var d2 = new Date(allTasks[k].taskTimeDate).toUTCString();
                    console.log("System DateTime"+d1);
                    console.log("Task DateTime"+d2);
                    console.log(d1>=d2);
                    if (d1 >= d2 && !allTasks[k].Completed)
                    {
                        console.log("K="+k);
                        Switch.findOneAndUpdate({'_id':allTasks[k].Switch},{$set:{'status':allTasks[k].status}},
                        function(err,upSw){
                            if(err)     throw err;
                            console.log(upSw);
                        });
                        /*Task.findByIdAndRemove(allTasks[k]._id,function(err,rmTsk){
                                if(err) throw err;
                                console.log(rmTsk.name+" Task Completed");
                         });*/
                        if (allTasks[k].repeat) {
                            if (allTasks[k].Repeat = 'hourly') {
                                var x = moment(allTasks[k].taskTimeDate);
                                x.add(1, 'hours');
                                allTasks[k].taskTimeDate = x.toDate();
                                allTasks[k].save(function (err, tk) {
                                    if (err) console.log(err);
                                    else console.log("Task " + tk.name + " Updated");
                                })
                            }
                            else if (allTasks[k].Repeat = 'daily') {
                                var x = moment(allTasks[k].taskTimeDate);
                                x.add(1, 'days');
                                allTasks[k].taskTimeDate = x.toDate();
                                allTasks[k].save(function (err, tk) {
                                    if (err) console.log(err);
                                    else console.log("Task " + tk.name + " Updated");
                                })
                            }
                            else if (allTasks[k].Repeat = 'weekly') {
                                var x = moment(allTasks[k].taskTimeDate);
                                x.add(1, 'weeks');
                                allTasks[k].taskTimeDate = x.toDate();
                                allTasks[k].save(function (err, tk) {
                                    if (err) console.log(err);
                                    else console.log("Task " + tk.name + " Updated");
                                })
                            }
                        }
                        else {
                            allTasks[k].Completed = true;
                            allTasks[k].save(function (err, tk) {
                                if (err) console.log(err);
                                else console.log(tk.name + " Completed");
                            })
                        }
                    }
                }
            }
        }
    });
    
},10000);


/************************** Socket.io ********************************/

require("./sockets/mySocket")(io);