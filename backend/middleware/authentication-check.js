const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token,'giiv_secret_key');
        req.userData = {email: decodedToken.email, userId: decodedToken._id};
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            alert: "Invalid token. Authentication failed"
        });
    }
};