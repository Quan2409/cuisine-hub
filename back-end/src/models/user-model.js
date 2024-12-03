const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    select: true,
  },

  location: {
    type: String,
    default: "No Location",
  },

  avatar: {
    type: String,
    default: "/user.png",
  },

  profession: {
    type: String,
    default: "No Profession",
  },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],

  views: [{ type: String }],

  verified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
  },
});

const userModal = mongoose.model("users", userSchema);
module.exports = userModal;
