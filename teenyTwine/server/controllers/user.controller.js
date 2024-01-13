const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt')
const secret_key = process.env.SECRET_KEY

// AUTHENTICATION
// register user
const register = (req, res) => {
    User.create(req.body)
        .then(newUser => {
            const userToken = jwt.sign({
                id: newUser._id
            }, secret_key)
            res.cookie('userToken', userToken, {
                httpOnly: true
                })
                .json({ msg: "Account Registered!", user: newUser });
        })
        .catch(err => res.json(err));
    }

// login user
const login = async(req, res) => {
        const possibleUser = await User.findOne({ email: req.body.email });
    
        if(!possibleUser) {
            // email not found in users collection
            return res.sendStatus(400);
        }
        // compare stored password and input password
        const correctPassword = await bcrypt.compare(req.body.password, possibleUser.password);
        if(!correctPassword) {
            return res.sendStatus(400);
        }
        // create Json Web token
        const userToken = jwt.sign({
            id: possibleUser._id
        }, secret_key );
        // add JWT to the cookie in response
        res.cookie("userToken", userToken, {
                httpOnly: true
            })
            .json({ msg: "Login Successful!" });
    }

// logout user
const logout = (req, res) => {
    res.clearCookie('userToken');
    res.sendStatus(200)
}


// CREATE
// READ
// UPDATE
// DELETE 

module.exports = {
    register,
    login, 
    logout
}