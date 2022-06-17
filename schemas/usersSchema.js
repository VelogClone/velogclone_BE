const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
