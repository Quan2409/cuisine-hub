const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  content: {
    type: String,
    required: [true, "Content is required"],
  },

  image: {
    type: String,
  },

  likes: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId }],
});

const postModal = mongoose.model("post", postSchema);
module.exports = postModal;
