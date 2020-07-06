const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    chat_name: {type: String, required: true},
    creator: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: String, required: true}
    // date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Message", messageSchema);