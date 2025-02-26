const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require('jsonwebtoken');
const becrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 3,
      max: 50,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please enter a valid Gender");
        }
      },
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a Strong Password.");
        }
      },
    },
    imageUrl: {
      type: String,
      default:
        "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a Valid Image Url");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getjwt = async function () {
  const user = this;
  const userJwtToken = jwt.sign({ _id: user._id }, "TSK@luffy@123", { expiresIn: '3d' });
  return userJwtToken;
}

userSchema.methods.validatePassword = async function(password) {
  const user = this;
  const passwordHash = user.password
  const isPasswordValid = await becrypt.compare(password, passwordHash);
  return isPasswordValid
}

module.exports = mongoose.model("User", userSchema);
// module.exports = mongoose.model('User', userSchema,'users'); -- this would be the custom name for the collections
