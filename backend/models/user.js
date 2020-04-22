const mongoose = require("mongoose");
const uniqueVal = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required:true},
    lastName: {type: String, required: true}
});
//gives error if it's tried a user to be saved with email
//that already exists
userSchema.plugin(uniqueVal);
module.exports = mongoose.model("User", userSchema);