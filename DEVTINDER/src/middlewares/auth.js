const jwt = require('jsonwebtoken');
const User = require('../models/user')

const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const validToken = token ==='xyz'? true: false;
    if (validToken) {
        next()
    } else {
        res.status(401).send("You don't have enough permissions");
    }
} 

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is Invalid");
        }
        const decodedObj = await jwt.verify(token, "TSK@luffy@123");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next()
    }catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
    
}

module.exports = { adminAuth , userAuth};