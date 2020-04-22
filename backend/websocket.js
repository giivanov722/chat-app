users = [];
connections = [];

const connect = (io) => {
    io.on('connection', socket => {
        console.log('user connected');
        socket.on('new-message', (message) => {
            console.log(`User with id: ${message.user_id} entered message: ${message.body}.`);
            io.emit('new-message', message);
        });
    });
}
module.exports.connect = connect;
