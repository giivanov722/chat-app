const app = require('./app');
const port = process.env.PORT || 3000;
app.set('port', port);
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const websocket = require('./websocket');
const chat = require('./chat');

server.listen(port, () => {
    chat.connect(io);
    console.log(`Server started on port ${port}`);
});


