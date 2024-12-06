const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/auth-controller");

// sign-up
router.post("/register", authController.handleSignUp);

// sign-in
router.post("/login", authController.handleSignIn);

module.exports = router;
