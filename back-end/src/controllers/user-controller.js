const userModal = require("../models/user-model");
const verifyModal = require("../models/verify-model");
const resetModal = require("../models/reset-model");
const { compareString, hashString } = require("../utils/handle-string");
const { sendResetPassword } = require("../utils/handle-email");

const userController = {
  // verify account
  verifyEmail: async (req, res, next) => {
    const { userId, token } = req.params;
    try {
      const emailRecord = await verifyModal.findOne({ userId });
      if (!emailRecord) {
        const message = "No verification found";
        return res.redirect(`/user/verified?status=error&message=${message}`);
      }

      const { expiredAt, token: hashedToken } = emailRecord;
      if (expiredAt < Date.now()) {
        await verifyModal.findOneAndDelete({ userId });
        await userModal.findOneAndDelete({ _id: userId });
        const message = "Token has expired";
        res.redirect(`/user/verified?status=error&message=${message}`);
      }

      const isMatch = await compareString(token, hashedToken);
      if (isMatch) {
        await userModal.findOneAndUpdate({ _id: userId }, { verified: true });
        await verifyModal.findOneAndUpdate({ userId });
        const message = "Email Verified Success";
        res.redirect(`/user/verified?status=success&message=${message}`);
      } else {
        const message = "Invalid verify link";
        res.redirect(`/user/verified?status=error&message=${message}`);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  },

  // send-reset-password-link
  sendResetLink: async (req, res, next) => {
    const { email } = req.body;
    const userRecord = await userModal.findOne({ email });
    if (!userRecord) {
      return res.status(404).json({
        status: "Failed",
        message: "Email address not found",
      });
    } else {
      await sendResetPassword(userRecord, res);
    }
  },

  // handle reset-password-link
  handleResetLink: async (req, res) => {
    const { userId, token } = req.params;
    try {
      const userRecord = await userModal.findById(userId);
      if (!userRecord) {
        const message = "Invalid reset link";
        res.redirect(`/user/reset-password?status=error&message=${message}`);
      }

      const resetRecord = await resetModal.findOne({ userId });
      if (!resetRecord) {
        const message = "Invalid reset link";
        res.redirect(`/user/reset-password?status=error&message=${message}`);
      }

      const { expiredAt, token: hashedToken } = resetRecord;
      if (expiredAt < Date.now()) {
        const message = "Reset password link has expired";
        res.redirect(`/user/reset-password?status=error&message=${message}`);
      }

      const isMatch = await compareString(token, hashedToken);
      if (isMatch) {
        res.redirect(`/user/reset-password?type=reset&id=${userId}`);
      } else {
        const message = "Invalid reset link";
        res.redirect(`/user/reset-password?status=error&message=${message}`);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  },

  // handle change-password
  changePassword: async (req, res) => {
    try {
      const { userId, password } = req.body;
      const hashedPassword = await hashString(password);
      const updateUser = await userModal.findByIdAndUpdate(
        { _id: userId },
        { password: hashedPassword }
      );
      if (updateUser) {
        await resetModal.findOneAndDelete(userId);
        res.status(200).json({
          ok: true,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = { userController };
