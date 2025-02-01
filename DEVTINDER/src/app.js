const connectDB  = require("./config/database");
const User = require('./models/user')

const express = require("express");
const app = express();

app.post('/signup', async (req, res) => {
  const userData = {
    firstname: "Sravan",
    lastName: "Thota",
    emailId: "thotasravankumar099@gmail.com",
    password: "qwertyuiop",
    age: 23,
    gender: "M"
  }
  const user = new User(userData);
  await user.save();
  res.send("User added Successfully...");
})

connectDB()
  .then(() => {
    console.log("DataBase connection is Established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
