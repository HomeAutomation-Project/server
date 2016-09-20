var Room = require("../model/Room.model.js")
var mongoose =  require("mongoose");
module.exports = function(io){
  io.on('connection', function (socket) {
  socket.emit('Request', { message: 'Authenticate' });
  console.log('Connected');
  
  socket.on('Authenticate', function (data) {
    console.log(data);
    
    Room.find({'_id':data})
    .populate('switches isOf')
    .exec(function(err,room){
      if(err) throw err;
      console.log(room);
      socket.emit('Success',{"data":room});
    })
  });
  
  socket.on('Request',function(data){});
});
}