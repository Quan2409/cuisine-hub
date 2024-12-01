const express = require("express");
const router = express.Router();
const authRouter = require("./auth-route");
const userRouter = require("./user-route");
const postRouter = require("./post-route");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);

module.exports = router;
