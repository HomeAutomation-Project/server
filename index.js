var app = require('./app/app.js')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(require('express').static(__dirname+'/public'));

server.listen(app.port,function(){
  console.log('Listening on '+app.ip+" : "+app.port)
});



/************************** Socket.io ********************************/

require("./sockets/mySocket")(io);