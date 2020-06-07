const users = [];

//Join user to chat
function userJoin(id, username, chatName) {
    const user = {id, username, chatName};
    users.push(user);
    return user;
}

// get current user

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// user leaves the chat

function userLeaveChat(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get users of the chat
function getChatUsers(chatName) {
    return users.filter(user => user.chatName === chatName);
}

function getUser(username) {
    return users.filter(user => user.username === username);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getChatUsers,
    getUser
}