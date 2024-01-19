const User = require('../models/user.model');
const Child = require('../models/child.model');
const Wishlist = require('../models/wishlist.model')
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt')
const secret_key = process.env.SECRET_KEY

// AUTHENTICATION
// register user // CREATE
const register = (req, res) => {
    User.create(req.body)
        .then(newUser => {
            const userToken = jwt.sign({
                id: newUser._id
            }, secret_key, {expiresIn: '1h'})
            res.cookie('userToken', userToken, {
                httpOnly: true
                })
                .json({ msg: "Account Registered!", user: newUser });
        })
        .catch(err => res.status(400).json(err));
    }

// login user
const login = async(req, res) => {
        const possibleUser = await User.findOne({ email: req.body.email })
            .populate("children")
            .populate({
                path: "wishlists", 
                populate: [
                    {path: "items"}, 
                    {path: "child"}
                ]
                });
    
        if(!possibleUser) {
            // email not found in users collection
            return res.sendStatus(400)
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
            .json({ msg: "Login Successful!", user: possibleUser });
    }

// logout user
const logout = (req, res) => {
    res.clearCookie('userToken');
    res.sendStatus(200)
}


// READ
const findOne = (req, res) => {
    User.findOne({_id : req.params.id}).populate("children")
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err))
}

// UPDATE
const updateUser = (req, res) => {
    //! RESEARCH HOW TO VALIDATE EMAIIL AND PASSWORD BEOFRE UPDATE
    console.log("UPDATING USER: " + req.params.id)
    User.findOneAndUpdate({_id: req.params.id}, req.body,  {new: true, runValidators: true})
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch(err => res.status(400).json(err))
}

// DELETE 
const deleteUser = async (req, res) => {
    try{
        // Delete Children of the list first
        await Child.deleteMany({parent : req.params.id})
        // Then delete the user
        const deletedUser = await User.findByIdAndDelete(req.params.id)

        res.status(200).json(deletedUser)
    }catch (err){
        res.status(400).json(err)
    }
}

module.exports = {
    register,
    login, 
    logout, 
    findOne, 
    updateUser,
    deleteUser
}