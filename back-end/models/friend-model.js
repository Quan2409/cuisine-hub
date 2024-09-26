const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  request_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  request_status: {
    type: String,
    default: "pending",
  },
});

const friendModal = mongoose.model("friend-request", requestSchema);
module.exports = friendModal;
