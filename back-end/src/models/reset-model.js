const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
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

const resetModal = mongoose.model("reset-passwords", resetPasswordSchema);
module.exports = resetModal;
