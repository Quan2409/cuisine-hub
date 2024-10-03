const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const helmet = require("helmet");
const database = require("./src/config/database-config");
const router = require("./src/routes/index-route");
const errorMiddleware = require("./src/middlewares/error-middleware");

// config dotenv
dotenv.config();

// config app
const app = express();
const port = process.env.PORT || 4000;

// config database
database();

// config static
app.use(express.static(path.join(__dirname, "views")));

// app.use()
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// config route
app.use(router);
app.use(errorMiddleware);

// handle 404 error
app.use((req, res, next) => {
  next(createError(404));
});

// http server
app.listen(port, () => {
  console.log(`HTTP server is running on: http://localhost:${port}`);
});

module.exports = app;
