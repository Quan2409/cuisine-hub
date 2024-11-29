const userModal = require("../models/user-model");
const { hashString, compareString } = require("../utils/handle-string");
const { sendVerificationEmail } = require("../utils/handle-email");
const createToken = require("../utils/handle-token");

const authController = {
  // account register
  handleSignUp: async (req, res, next) => {
    const { firstName, lastName, email, password, confirm } = req.body;
    try {
      if (!(firstName || lastName || email || password || confirm)) {
        next("Please enter all required field");
        return;
      }

      // firstname validation
      if (!firstName) {
        next("Enter your first name, please.");
        return;
      } else if (!/^[a-zA-Z0-9\s]+$/.test(firstName)) {
        next("First name must not contain special characters");
      }

      // lastname validation
      if (!lastName) {
        next("Enter your last name, please.");
        return;
      } else if (!/^[a-zA-Z0-9\s]+$/.test(lastName)) {
        next("Last name must not contain special characters");
      }

      // email validation
      if (!email) {
        next("Enter your email, please");
        return;
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        next("Email is wrong format, try again");
        return;
      }

      // password validation
      if (!password) {
        next("Enter your password, please");
        return;
      } else if (password.length < 6) {
        next("Password must be at least 6 characters");
        return;
      } else if (!/^\S+$/.test(password)) {
        next("Password must not contain white space");
      }

      // confirm password validation
      if (!confirm) {
        next("Confirm password is required");
        return;
      } else if (password !== confirm) {
        next("Confirm Password is not match");
        return;
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
    } catch (error) {
      if (error.name === "validationError") {
        console.log(error);
        res.status(400).json({ message: error.message });
      }
      return;
    }
  },

  // account login
  handleSignIn: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // email validation
      if (!email) {
        next("Enter your email, please");
        return;
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        next("Email is wrong format, try again");
        return;
      }

      // password validation
      if (!password) {
        next("Enter your password, please");
        return;
      }

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
