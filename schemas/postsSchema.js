const mongoose = require('mongoose');

const AutoIncrement = require('mongoose-sequence')(mongoose);

const PostSchema = new mongoose.Schema({
  postId: {
    type: Number,
    // required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
  },
  postContent: {
    type: String,
    required: true,
  },
  postDate: {
    type: String,
    required: true,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
    // required: true,
  },
  userImage: {
    type: String,
  },
  
});

PostSchema.plugin(AutoIncrement, { inc_field: 'postId' });
module.exports = mongoose.model('Post', PostSchema);
<<<<<<< HEAD

// PostSchema.virtual("postId").get(function () {
//     return this._id.toHexString();
//   });
//   PostSchema.set("toJSON", {
//     virtuals: true,
//   });
=======
>>>>>>> 27e759dff461bd6bcfc08cea35fdaecdd47ef934
