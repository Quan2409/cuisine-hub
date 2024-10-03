const userModal = require("../models/user-model");
const { hashString, compareString } = require("../utils/handle-string");
const { sendVerificationEmail } = require("../utils/handle-email");
const createToken = require("../utils/handle-token");

const authController = {
  // account register
  handleSignUp: async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName || lastName || email || password)) {
      next("Please provide required fields");
      return;
    }

    try {
      const userRecord = await userModal.findOne({ email });
      if (userRecord) {
        next("Email already exist");
        return;
      }

      const hashedPassword = await hashString(password);
      const newUser = await userModal.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      sendVerificationEmail(newUser, res);
    } catch (error) {
      if (error.name === "validationError") {
        console.log(error);
        res.status(400).json({ message: error.message });
      } else {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    }
  },

  // account login
  handleSignIn: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!(email || !password)) {
        next("Please enter required field");
      }

      const userRecord = await userModal
        .findOne({ email })
        .select("+password")
        .populate({
          path: "friends",
          select: "firstName lastName location avatar -password",
        });

      if (!userRecord) {
        next("Invalid email or password");
        return;
      }

      if (!userRecord.verified) {
        next("Accounts is not verified. Please check your email");
        return;
      }

      const isMatch = await compareString(password, userRecord.password);
      if (!isMatch) {
        next("Invalid email or password");
        return;
      }

      userRecord.password = undefined;
      const token = createToken(userRecord._id);
      res.status(201).json({
        message: "Login Success",
        token: token,
      });
    } catch (error) {
      res.status(404).json({
        message: error.message,
      });
    }
  },
};

module.exports = { authController };
