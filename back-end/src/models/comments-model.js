const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments", // Liên kết đến comment cha
    default: null, // Null nếu là bình luận cấp 1
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
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // replies: [
  //   {
  //     replyId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //     },

  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "users",
  //     },

  //     from: {
  //       type: String,
  //     },

  //     replyAt: {
  //       type: String,
  //     },

  //     comment: {
  //       type: String,
  //     },

  //     likes: [
  //       {
  //         type: String,
  //       },
  //     ],

  //     createdAt: {
  //       type: Date,
  //       default: Date.now(),
  //     },

  //     updateAt: {
  //       type: Date,
  //       default: Date.now(),
  //     },
  //   },
  // ],
});

const commentModal = mongoose.model("comment", commentSchema);
module.exports = commentModal;
