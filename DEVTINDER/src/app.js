const connectDB  = require("./config/database");
const User = require('./models/user')
const {validateSignUpData} = require('./utils/validation')

const express = require("express");
const becrypt = require('bcrypt');
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignUpData(req);

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await becrypt.hash(password, 10);

    //create a user
    const createdUser = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });
    createdUser.save();
    res.send(createdUser);
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.post('/login', async (req, res) => {
  try { 
    const { emailId , password} = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials.");
    }
    const validPassword = await becrypt.compare( password, user.password);
    if (!validPassword ){
      throw new Error("Please enter a valid Password");
    }
    else {
      res.send("Login Successfull");
    }
  }
  catch (err){
    res.status(400).send("ERROR: " + err.message);
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
