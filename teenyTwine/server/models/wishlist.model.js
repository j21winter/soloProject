const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        minlength: [3, "Title must be 3 characters or more"]
    },
    child : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },
    parent : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    }]
}, {timestamps: true});

module.exports = mongoose.model("WishList", WishlistSchema)