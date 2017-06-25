var http = require('http');
var https = require('https');
var express = require('express');
var compress = require('compression');
var path = require('path');
var wsServerPort = 3000;


var app = express();
app.use(compress());
app.use(express.static(__dirname));


var WebSocketServer = require('websocket').server;
var server = http.createServer(app);

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});



var clients = [];
var data={}
// WebSocket server
wsServer.on('request', function(request) {
    //check for origin of the request and accordingly allow them.
    var connection = request.accept(null, request.origin);
    var clientIndex = clients.push(connection) - 1;

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
    	var userObj=message.utf8Data;
    	var userId=userObj.userId;
    	data[userId]=userObj.userData;
    	console.log(clients.length);
        if (message.type === 'utf8') {
            for (var i = 0; i < clients.length; i++) {
            	console.log('sending');
                clients[i].sendUTF(JSON.stringify(data));
            }
        }
    });

    connection.on('close', function(connection) {
        clients.splice(clientIndex, 1)
            // close user connection
    });
});

server.listen(wsServerPort, function() {
    console.log('server is started at port ', wsServerPort)
});

app.get('/*', function(req, res) {

    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());

    res.sendFile(path.join(__dirname + '/doodle.html'));
});
