const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const helmet = require("helmet");
const database = require("./src/config/database-config");
const indexRouter = require("./src/routes/index-route");
const errorMiddleware = require("./src/middlewares/error-middleware");

// config dotenv
dotenv.config();

// config app
const app = express();

// config cors
app.use(cors());

// config database
database();

// config static
app.use(express.static(path.join(__dirname, "src", "views")));

// config tempalte engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// config static file
app.use(express.static("public"));

// confid body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config morgan
app.use(morgan("dev"));

// config helmet
app.use(helmet());

// config route
app.use(indexRouter);
app.use(errorMiddleware);

// handle 404 error
app.use((req, res, next) => {
  res.status(404).render("error", { layout: false });
});

// http server
const port = 10000;
app.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server is running on: http://localhost:${port}`);
});

module.exports = app;
