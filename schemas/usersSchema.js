const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('User', UserSchema);