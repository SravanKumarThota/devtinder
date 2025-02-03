const mongoose = require("mongoose");

// mongoose.connect('connectionUrl/database')

const connectDB = async () => {
  try {
    await mongoose.connect(
      ""
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
