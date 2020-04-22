const app = require('./app');
const port = process.env.PORT || 3000;
app.set('port', port);
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const websocket = require('./websocket');

websocket.connect(io);


server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


