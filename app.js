var express = require('express');
var app = express();
var syc = require('syc');

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

var io = require('socket.io')(server);

// Syc logic - Creating an array of messages to by synchronized
var messages = syc.sync('messages', []);

syc.verify(syc.list('messages'), function (changes, socket) { 
  var change = changes.change,
      properties = getProperties(change);

  if (typeof change !== 'object') {
    return false;
  }
  if (properties.length !== 2) {
    return false;
  }
  if (!change.content || !change.screenname) {
    return false;
  }
  if (typeof change.content !== 'string' && typeof change.screenname !== 'string') {
    return false;
  }

  return true;

  function getProperties (object) { 
    var properties = [];
    for (var property in object) {
      properties.push(property);
    }
    return properties;
  }
});
console.log(syc.verifiers);

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
