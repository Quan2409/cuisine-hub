const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// verify-email
router.get("/verify", userController.viewStatus);
router.get("/verify/:userId/:token", userController.verifyEmail);

// reset-password
router.post("/reset-request", userController.sendResetLink);
router.get("/reset-password/:userId/:token", userController.handleResetLink);
router.get("/reset-password", userController.viewResetPage);
router.get("/reset-status", userController.viewStatus);
router.post("/change-password", userController.changePassword);

// user-profile
router.get("/get-user/:id?", authMiddleware, userController.getUser);
router.put("/update-user", authMiddleware, userController.updateUser);

// send friend request
router.post(
  "/friend-request",
  authMiddleware,
  userController.sendFriendRequest
);

// get friend request
router.get(
  "/get-friend-request",
  authMiddleware,
  userController.getFriendRequest
);

// accept / deny friend request
router.post("/accept-request", authMiddleware, userController.acceptRequest);

// profile viewer
router.post("/profile-viewer", authMiddleware, userController.viewProfile);

// suggest friend
router.get("/suggested-friends", authMiddleware, userController.suggestFriend);

module.exports = router;
