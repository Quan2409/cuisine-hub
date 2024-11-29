const mongoose = require("mongoose");

const connectString =
  "mongodb+srv://khacquan2409:atlas24865@cuisine-hub-cluster-m0.obsp8.mongodb.net/cuisine-hub";

const connectDatabase = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Database is connected");
  } catch (error) {
    console.log("Connect failed: " + error);
  }
};

module.exports = connectDatabase;
