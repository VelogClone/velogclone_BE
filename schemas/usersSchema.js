const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  nickname: {
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

// UserSchema.virtual('userId').get(function () {
//   return this._id.toHexString();
// });
// UserSchema.set('toJSON', {
//   virtuals: true,
// });
