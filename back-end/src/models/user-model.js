const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Firs name is required"],
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password length should be greater than 6"],
    select: true,
  },

  location: {
    type: String,
  },

  avatar: {
    type: String,
  },

  profession: {
    type: String,
  },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  verified: {
    type: Boolean,
    default: false,
  },
});

const userModal = mongoose.model("user", userSchema);
module.exports = userModal;
