const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CommentSchema = mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },

  commentDate: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },
  
  userImage: {
    type: String,
    required: true,
  },

  postId: {
    type: Number,
    required: true,
  },
});

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });
module.exports = mongoose.model('Comment', CommentSchema);

