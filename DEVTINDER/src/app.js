const connectDB  = require("./config/database");
const User = require('./models/user')

const express = require("express");
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
  const userData = req.body;
  try {
    const createdUser = await User.create(userData);
    res.send(createdUser);
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      res.status(404).send("User not found");
    }
    res.send(userDoc);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch(err) {
    res.status(400).send(err.message);
  }
})

app.post('/user', async (req, res) => {
  const email = req.body?.email;
  try {
    if (!email)
      throw new Error("Provide a valid email");
    const userDoc = await User.find({ emailId: email });
    if (!userDoc) {
      throw new Error("User Not found");
    }
    res.send(userDoc);
  } catch (err) {
    
  }
})

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", 
      runValidators:true
    })
    res.send(user);
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
  }
});



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
