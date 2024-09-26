const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const database = require("./config/database-config");

// config dotenv
dotenv.config();

// config app
const app = express();
const port = process.env.PORT || 4000;

// config database
database();

// app.use()
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// handle 404 error
app.use((req, res, next) => {
  next(createError(404));
});

// http server
app.listen(port, () => {
  console.log(`HTTP server is running on port: ${port}`);
});

module.exports = app;
