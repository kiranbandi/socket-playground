// Loading assets
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var uniqid = require('uniqid');

//For hosting our static html assets at the root path
app.use('/', express.static(__dirname + '/source'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/src/');
});

var dataStore = {};

io.on('connection', function(client) {

    // create a unique code each time some one joins the channel   
    client.uniqueId = uniqid();
    // empty block for new guy in the common store
    dataStore[client.uniqueId] = [];
    // response to the new guy
    client.emit('new_join', { id: client.uniqueId, data: dataStore });
    // response to everyone else
    client.broadcast.emit('broad', dataStore);

    client.on('messages', function(request) {
        dataStore[client.uniqueId] = request.data;
        client.broadcast.emit('broad', dataStore);
    });

    client.on('disconnect', function() {
        delete dataStore[client.uniqueId];
        client.broadcast.emit('broad', dataStore);
    });

});

server.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Live at http://%s:%s", host, port)
})