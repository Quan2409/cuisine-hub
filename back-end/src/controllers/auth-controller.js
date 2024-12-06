const userModal = require("../models/user-model");
const { hashString, compareString } = require("../utils/handle-string");
const { sendVerificationEmail } = require("../utils/handle-email");
const createToken = require("../utils/handle-token");

const authController = {
  // sign-up function
  handleSignUp: async (req, res, next) => {
    const { firstName, lastName, email, password, createdAt } = req.body;
    try {
      // check if email already exits
      const userRecord = await userModal.findOne({ email });
      if (userRecord) {
        return res.status(400).json({
          status: false,
          message: "Email is already exist, please try again",
        });
      }

      // hash-password
      const hashedPassword = await hashString(password);

      // query to create a new user
      const newUser = await userModal.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        createdAt,
      });

      // send email verification
      await sendVerificationEmail(newUser, res);

      return res.status(201).send({
        status: true,
        message: "Verification email has been sent to your email",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  // sign-in function
  handleSignIn: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // queery to check if user exits or not
      const userRecord = await userModal.findOne({ email }).select("+password");
      if (!userRecord) {
        return res.status(404).json({
          status: false,
          message: "User is not found, please try again",
        });
      }

      if (!userRecord.verified) {
        return res.status(400).json({
          status: false,
          message: "User is not verifed, please check your email",
        });
      }

      // compare password from database with input value
      const isMatch = await compareString(password, userRecord.password);
      if (!isMatch) {
        return res.status(400).json({
          status: false,
          message: "Password is incorect, please try again",
        });
      }

      // create new-token
      const token = createToken(userRecord._id);

      return res.status(201).json({
        message: "Account Login Successfully",
        token: token,
        user: userRecord,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};

module.exports = { authController };
