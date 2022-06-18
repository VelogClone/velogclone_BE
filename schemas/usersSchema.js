const mongoose = require('mongoose')


const { Schema } = mongoose
const UsersSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

<<<<<<< HEAD
});

module.exports = mongoose.model('User', UsersSchema,);
=======
const UserSchema = new mongoose.Schema({
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
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
