const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  userId: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },

  token: {
    type: String,
  },

  createdAt: {
    type: Date,
  },

  expiredAt: {
    type: Date,
  },
});

const passwordModal = mongoose.model("resetPassword", passwordSchema);
module.exports = passwordModal;
