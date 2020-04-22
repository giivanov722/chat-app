const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authCheck = require('../middleware/authentication-check');
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        user.save()
        .then(result => {
            res.status(201).json({
              message: 'User saved',
                result: result
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    })
});

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({username: req.body.username})
    .then(user => {
        console.log(user);
        if(!user){
            return res.status(401).json({
                message: 'Incorrect user'
            });
        }
        fetchedUser = user;
        console.log("password " + req.body.password + ", " + user.password);
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        console.log(result);
        if(!result){
            return res.status(401).json({
                message:'Incorrect password'
            });
        }
        const token = jwt.sign(
            {email: fetchedUser.email, userId: fetchedUser._id},
            'giiv_secret_key',
            {expiresIn: '1h'}//1800000 miliseconds - 30 min
        );
       
        res.status(200)
        .cookie('token', token, {
            //here are the options for the cookie
            // expires: new Date(Date.now())
            maxAge: 3600000,
            secure: false, // set to true if using https
            httpOnly: true,
        })
        .json({
            expires: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.username,
            firstName: fetchedUser.firstName,
            lastName: fetchedUser.lastName
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    });
});

router.get('/logout', authCheck, (req,res,err) => {
    res.status(200).clearCookie('token').json({
        message:'Logout sucessfull!'
    });
});

router.get('/users', authCheck, (req,res,next)=>{
    console.log("I am in getting users backend");
    let fetchedUsers;
    User.find({}, (err, users) => {
        console.log(users);
        fetchedUsers = users.map(user => {
            return {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
        res.status(200)
        .json({
            users: fetchedUsers
        })
    });
})

module.exports = router;