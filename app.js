var express = require('express');
var app = express();
var syc = require('syc');
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
var io = require('socket.io')(server);

// Syc logic - Creating an array of messages which Syc will synchronize.
var messages = syc.sync('messages', []);

// Verification. Santizing all incoming messages
syc.verify(syc.list('messages'), function (changes, socket) { 
  var change = changes.newValue,
      properties = getProperties(change);

  // Ensure it's an 1) object that
  if (typeof change !== 'object') {
    return false;
  }
  // 2) has two properties
  if (properties.length !== 2) {
    return false;
  }
  // 3) called 'content' & 'screenname' 
  if (!change.content || !change.screenname) {
    return false;
  }
  // 4) which are strings.
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
