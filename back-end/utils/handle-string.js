const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// handle hash string
const hashString = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// handle compare string
const compareString = async (userPassword, passwordRecord) => {
  return bcrypt.compare(userPassword, passwordRecord);
};

module.exports = {
  hashString,
  compareString,
};
