const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
    brand : {
        type: String,
        required: true
    },
    item : {
        type: String,
        required: true
    },
    size : {
        type: String,
        required: true
    },
    minHeight : {
        type: Number,
        required: true
    },
    maxHeight : {
        type: Number,
        required: true
    },
    minWeight : {
        type: Number,
        required: true
    },
    maxWeight : {
        type: Number,
        required: true
    }
})