const mongoose = require('mongoose')

const ChildSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Child name is required'],
        trim: true,
        minlength: [3, 'Child name must be 3 characters or more!']
    },

    birthDate: {
        type: Date,
        required: [true, 'Child birth date is required'],
        trim: true,
    },

    height: {
        type: Number,
        required: [true, 'Child height is required'],
        min: [0.1, "Child Height must be more than 0" ]
    },

    weight: {
        type: Number,
        required: [true, 'Child height is required'],
        min: [0.1, "Child weight must be more than 0" ]
    },

    history: [{
        height: { type: Number },
        weight: { type: Number },
        dateAdded: { type: Date } 
    }],

    parent : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model('Child', ChildSchema)