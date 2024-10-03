const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    re: "user",
  },

  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },

  comment: {
    type: String,
    required: true,
  },

  likes: [
    {
      type: String,
    },
  ],

  from: {
    type: String,
    required: true,
  },

  replies: [
    {
      replyId: { type: mongoose.Schema.Types.ObjectId },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      from: { type: String },
      replyAt: { type: String },
      comment: { type: String },
      likes: [{ type: String }],
      createdAt: {
        type: Date,
        default: Date.now(),
      },

      updateAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const commentModal = mongoose.model("comment", commentSchema);
module.exports = commentModal;
