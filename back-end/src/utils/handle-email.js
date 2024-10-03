const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const verifyModal = require("../models/verify-model");
const resetModal = require("../models/reset-model");
const { v4: createUUID } = require("uuid");
const { hashString } = require("./handle-string");

// config env
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName } = user;
  const token = _id + createUUID();
  const link = process.env.APP_URL + "/user/verified/" + _id + "/" + token;

  const mailOption = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Cuisine Hub - Account Verification",
    html: `
      <div style="border-radius: 5px; padding: 20px; font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7;">
      <h3 style="color: #ffd700; font-size: 2rem">
        Please verify your email address
      </h3>
      <hr />
      <h4>Hi ${lastName},</h4>
      <p>
        Please verify your email address so we can know that it's really you.
      </p>
      <p>This link <b>expires in 1 hour</b></p>
      <br />
      <a href="${link}" style="padding: 14px; color: #fff; text-decoration: none; background-color: #ffd700; border-radius: 8px; font-size: 18px;">
      Verify Email Address
      </a>
      <div style="margin-top: 60px">
        <h5>Best Regards</h5>
      </div>
      </div>
    `,
  };

  try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await verifyModal.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    if (newVerifiedEmail) {
      transporter.sendMail(mailOption, (error) => {
        if (error) {
          console.log(error);
          return res.status(404).json({
            message: `Sending message fail: ${error}`,
          });
        }
        res.status(201).send({
          message: "Verification email has been sent to your email",
        });
      });
    }
  } catch (error) {
    res.status(404).json({
      message: `Verification error: ${error} `,
    });
  }
};

const sendResetPassword = async (user, res) => {
  const { _id, email } = user;
  const token = _id + createUUID();
  const link =
    process.env.APP_URL + "/user/reset-password/" + _id + "/" + token;

  const mailOption = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Cuisine Hub - Password Reset",
    html: `
    <div style="border-radius: 5px; padding: 20px; font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7;">
      <h3 style="color: #ffd700; text-align: center; font-size: 2rem">
        Password Change Request.
      </h3>
      <hr />
      <p>Click the button and it will go to the form that you can create new password</p>
      <p>This link <b>expires in 10 minutes</b></p>
      <br />
      <a href="${link}" style="padding: 14px; color: #fff; text-decoration: none; background-color: #ffd700; border-radius: 8px; font-size: 18px;">
      Reset Password
      </a>
      </div>
    `,
  };
  try {
    const hashedToken = await hashString(token);
    const newRequest = await resetModal.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiredAt: Date.now() + 600000,
    });

    if (newRequest) {
      await transporter.sendMail(mailOption);
      res.status(201).send({
        status: "Pending...",
        message: "Reset password link has been sent",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = { sendVerificationEmail, sendResetPassword };
