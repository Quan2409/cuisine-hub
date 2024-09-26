const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  userId: {
    type: String,
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

const emailVerification = mongoose.model("verification", emailSchema);
module.exports = emailVerification;
