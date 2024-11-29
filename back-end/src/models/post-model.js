const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  content: {
    type: String,
  },

  image: {
    type: String,
  },

  likes: [
    {
      type: String,
    },
  ],

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const postModal = mongoose.model("posts", postSchema);
module.exports = postModal;
