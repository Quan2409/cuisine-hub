const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect database success");
  } catch (error) {
    console.log("Connect database fail: " + error);
  }
};

module.exports = connectDatabase;
