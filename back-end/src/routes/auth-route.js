const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/auth-controller");

// account register
router.post("/register", authController.handleSignUp);

// account login
router.post("/login", authController.handleSignIn);

module.exports = router;
