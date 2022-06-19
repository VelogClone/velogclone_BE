const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
   type: String,
  required: true,
},
  password: {
    type: String,
    required: true,
  },
  //userImage: {
  //  type: String,
  //},
});

module.exports = mongoose.model('User', UserSchema);