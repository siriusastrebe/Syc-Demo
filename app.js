var express = require('express');
var app = express();
var syc = require('syc');

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

var io = require('socket.io')(server);

// Syc logic
var messages = syc.sync('messages', []);

// Routes
app.get('/', function(req, res){
  res.sendfile('chat.html');
});

app.get('/syc.js', function (req, res){
  res.sendfile('node_modules/syc/client/syc.js');
});

// Socket.io && Syc initalization
io.on('connection', function (socket) {
  syc.connect(socket);
});
