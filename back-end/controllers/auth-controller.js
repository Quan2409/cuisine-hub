const userModal = require("../models/user-model");
const { hashString } = require("../utils/handle-string");

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

      const newUser = await userModal.create({
        firstName,
        lastName,
        email,
        password: hashString(password),
      });
    } catch (error) {
      if (error.name === "validationError") {
        res.status(400).json({ status: false, message: error.message });
      } else {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
    }
  },

  // account login
  handleSignIn: async () => {
    //
  },
};

module.exports = { authController };
