const nodemailer = require("nodemailer");
const emailModal = require("../models/email-model");

const transporter = nodemailer.createTransport({
  service: "Gmail",
});
