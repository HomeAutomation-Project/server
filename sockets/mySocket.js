module.exports = function(io){
  io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  console.log('Connected');
  socket.on('myevent', function (data) {
    console.log(data);
  });
});
}