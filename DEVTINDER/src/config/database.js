const mongoose = require("mongoose");

// mongoose.connect('connectionUrl/database')

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://thotasravankumar099:S7KctzeKuHoIyn68@sravanthota.0r9th.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
