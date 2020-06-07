// const express = require('express');
// const jwt = require('jsonwebtoken');
// const authCheck = require('../middleware/authentication-check');
// const router = express.Router();
const moment = require('moment');
const {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getChatUsers
} = require('./chat_utils')

const connect = (io) => {
    io.on('connection', socket => {
        
        console.log("Socket: " + socket);
        socket.on('joinChat', ({username, chatName}) => {
            const user = userJoin(socket.id, username, chatName);
            console.log('user ' + user.username + 'joined ' + user.chatName);
            socket.join(user.chatName);
        });

        //listen for messages
        socket.on('new-message', msg => {
            const user = getCurrentUser(socket.id);
            io.to(user.chatName).emit('new-message', formatMessage(msg.username, msg.body));
        });

        //Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeaveChat(socket.id);
            if(user){
                console.log('user ' + user.username + ' has disconnected properly');
                io.to(user.chat).emit(
                    'message',
                    formatMessage('Gosho', `${user.username} has left the chat`)
                )
            }
            console.log('Disconnection unsucessful');
        })

        // router.post("/startChat", authCheck, (req, res, next) => {
        //     const chatName = req.body.chatName
        //     chatName.findOne({chatName: chatName})
        //     .then(chat => {
        //         if(!chat){
        //             const chat = new Chat({
        //                 chatName: chatName,
        //                 messages: [{}]
        //             });
        //             chat.save()
        //             .then(chat => {
        //                 io.on('startChat', chatName)
        //             })
        //         }
        //     })
        // })

    });

    function formatMessage(username, body) {
        return {
            username,
            body,
            time: moment().format('h:mm a')
        };
    }
}

module.exports.connect = connect;