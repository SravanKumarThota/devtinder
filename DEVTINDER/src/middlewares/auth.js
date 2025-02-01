const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const validToken = token ==='xyz'? true: false;
    if (validToken) {
        next()
    } else {
        res.status(401).send("You don't have enough permissions");
    }
} 

module.exports = { adminAuth };