const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  request_receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  request_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  request_status: {
    type: String,
    default: "pending..",
  },
});

const friendModal = mongoose.model("friend-request", requestSchema);
module.exports = friendModal;
