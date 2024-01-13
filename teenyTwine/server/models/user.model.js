const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: [true, 'First name is required'],
        minlength : [3, 'First name must be 3 or more characters'],
        trim: true
    },
    lastName : {
        type: String,
        required: [true, 'Last name is required'],
        minlength : [3, 'Last name must be 3 or more characters'],
        trim: true
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate: [
            {
                validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
                message: "Please enter a valid email"
            },
            {
                validator: async val => {
                    let foundUser = await mongoose.models.User.findOne({email : val})
                    return !foundUser;
                }, 
                message: "Email already in use!"
        }]
    
    },
    password : {
        type : String,
        required: [true, 'Password is required'],
        minlength : [8, 'Password must be 8 or more characters'],
        trim: true
    },
    children: {
        type: Array
    },
    wishList: {
        type: Array
    }, 
    registries: {
        type: Array
    }
}, {timestamps : true});

// MIDDLEWEAR

// do not save confirm password in the db
UserSchema.virtual('confirmPassword')
    .get( () => this.confirmPassword )
    .set( value => this.confirmPassword = value );

// validate password match
UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
    });

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
        this.password = hash;
        next();
        });
    });

module.exports = mongoose.model('User', UserSchema);