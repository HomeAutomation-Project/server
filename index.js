var app = require('./app/app.js')('codeanywhere');

app.use(require('express').static(__dirname+'/public'));

app.listen(app.port,function(){
  console.log('Listening on '+app.ip+" : "+app.port)
});