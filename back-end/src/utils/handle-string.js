const bcrypt = require("bcrypt");

// handle hash string
const hashString = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// handle compare string
const compareString = async (userPassword, passwordRecord) => {
  return await bcrypt.compare(userPassword, passwordRecord);
};

module.exports = {
  hashString,
  compareString,
};
