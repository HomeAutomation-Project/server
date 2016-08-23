var app = require('./app/index.js')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(require('express').static(__dirname+'/public'));

server.listen(app.get('port'),function(){
  console.log('Listening on '+app.get('ip')+" : "+app.get('port'))
});



/************************** Socket.io ********************************/

require("./sockets/mySocket")(io);