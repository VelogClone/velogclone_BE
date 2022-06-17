const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PostSchema = mongoose.Schema({
    postId: {
        type: Number,
        required: true
    },
    postTitle: {
        type: String,
        required: true
    },
    postImage: {
        type: String,
    },
    postContent: {
        type: String,
        required: true
    },
    postDate: {
        type: String,
        required: true
    },
    commentCount: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true
    }

})

PostSchema.plugin(AutoIncrement, { inc_field: 'postId' });
module.exports = mongoose.model('Post', PostSchema);

// PostSchema.virtual("postId").get(function () {
//     return this._id.toHexString();
//   });
//   PostSchema.set("toJSON", {
//     virtuals: true,
//   });
