const mongoose = require("mongoose")

const isTitleUnique = async function (title, wishlistId) {
    const query = { title, _id: { $ne: wishlistId } };
    const foundWishlist = await mongoose.models.Wishlist.findOne(query);
    return !foundWishlist;
};
const WishlistSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        minlength: [3, "Title must be 3 characters or more"],
        unique: [true, "Wishlist title already in use"],
        validate: [
            {
                validator: async function (val) {
                    return await isTitleUnique(val, this._id);
                },
                message: "Wishlist title already in use!",
            },
        ],
    },
    child : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: false
    },
    parent : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: false
    }]
}, {timestamps: true});

module.exports = mongoose.model("Wishlist", WishlistSchema)