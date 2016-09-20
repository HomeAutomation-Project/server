var Room = require("../model/Room.model.js")


module.exports = function(io){
  io.on('connection', function (socket) {
  socket.emit('Request', { message: 'Authenticate' });
  console.log('Connected');
  socket.on('Authenticate', function (data) {
    console.log(data);
    Room.findById(data._id)
    .populate('switches isOf')
    .exec(function(err,data){if(err) throw err;
      console.log(data);
      socket.emit('Success',data);
    });
  });
});
}