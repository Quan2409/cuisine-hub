const express = require("express");
const router = express.Router();
const authRouter = require("./auth-route");
const userRouter = require("./user-route");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;
