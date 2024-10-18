const express = require("express");
const path = require("path");
const router = express.Router();
const { userController } = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// verify-email
router.get("/verified/:userId/:token", userController.verifyEmail);
router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/build", "verified.html"));
});

// reset-password
router.post("/reset-request", userController.sendResetLink);
router.get("/reset-password/:userId/:token", userController.handleResetLink);
router.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views/build", "reset.html"));
});
router.post("/change-password", userController.changePassword);

// user-profile
router.get("user-profile/:id?", authMiddleware, userController.getUser);

module.exports = router;
