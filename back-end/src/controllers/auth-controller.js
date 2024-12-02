const userModal = require("../models/user-model");
const { hashString, compareString } = require("../utils/handle-string");
const { sendVerificationEmail } = require("../utils/handle-email");
const createToken = require("../utils/handle-token");

const authController = {
  // account register
  handleSignUp: async (req, res, next) => {
    const { firstName, lastName, email, password, confirm } = req.body;
    try {
      if (!confirm) {
        errors.push("Confirm password is required");
      } else if (password !== confirm) {
        errors.push("Confirm Password is not match");
      }
      const userRecord = await userModal.findOne({ email });
      if (userRecord) {
        next("Email is already exist, please try again");
        return;
      }
      const hashedPassword = await hashString(password);
      const newUser = await userModal.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await sendVerificationEmail(newUser, res);
      return res.status(201).send({
        status: true,
        message: "Verification email has been sent to your email",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Internal server error" });
    }
  },

  // account login
  handleSignIn: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // query to search user base on email
      const userRecord = await userModal
        .findOne({ email })
        .select("+password")
        .populate({
          path: "friends",
          select: "firstName lastName location avatar -password",
        });

      if (!userRecord) {
        next("Account is not found, try again");
        return;
      }

      if (!userRecord.verified) {
        next("Account is not verified. Check your email");
        return;
      }

      const isMatch = await compareString(password, userRecord.password);
      if (!isMatch) {
        next("Password is incorect, try again");
        return;
      }
      const token = createToken(userRecord._id);
      res.status(201).json({
        message: "Account Login Successfully",
        token: token,
        user: userRecord,
      });
    } catch (error) {
      res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};

module.exports = { authController };
