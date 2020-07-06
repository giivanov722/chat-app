// const express = require('express');
// const jwt = require('jsonwebtoken');
// const authCheck = require('../middleware/authentication-check');
// const router = express.Router();
const moment = require('moment');
const Message = require('./models/message');
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
            Message.find({chat_name: chatName}).limit(100).exec(function(err, msgs){
                const user = userJoin(socket.id, username, chatName);
                console.log('user ' + user.username + 'joined ' + user.chatName);
                socket.join(user.chatName);
                io.to(user.chatName).emit('old-messages', msgs);
            })
            
        });

        //listen for messages
        socket.on('new-message', msg => {
            const user = getCurrentUser(socket.id);
            const message = new Message({
                chat_name: msg.chat_name,
                creator: msg.creator,
                body: msg.body,
                date: moment().format('ll')
            });
            message.save()
            .catch(err => {
                console.log("Error with message saving: " + err);
            })
            io.to(user.chatName).emit('new-message', formatMessage(msg.creator, msg.body));
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
    });

    function formatMessage(creator, body) {
        return {
            creator,
            body,
            date: moment().format('ll')
        };
    }
}

module.exports.connect = connect;