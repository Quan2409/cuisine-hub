const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/auth-controller");

router.post("/register", authController.handleSignUp);
router.post("/login", authController.handleSignIn);

module.exports = router;
