const Wishlist = require('../models/wishlist.model')

// CREATE
const createList = (req, res) => {
    Wishlist.create(req.body)
        .then(newList => res.status(200).json(newList))
        .catch(err => res.status(400).json(err))
}

const createChildList = async (data) => {
    try {
        const newWishList = await Wishlist.create(data)
        return newWishList
    } catch (err) {
        console.log(err)
    }
}
// READ
const findAllLists = (req, res) => {
    Wishlist.find({parent: req.params.parentId})
        .then(allWishlists => res.status(200).json(allWishlists))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
}
// UPDATE
const addItem = (req, res) => {
    const {itemId, wishListId} = req.params
    Wishlist.findOneAndUpdate(
        {_id : wishListId}, 
        {
            $push: {items : itemId}
        },
        { new: true, runValidators: true }
    )
    .then(UpdatedWishList => {
        res.status(200).json(UpdatedWishList)
    })
    .catch(err => {
        res.status(400).json(err)
    })
}

const removeItem = (req, res) => {
    const {itemId, wishListId} = req.params
    WishList.findOneAndUpdate(
        {_id : wishListId}, 
        {
            $pull : {items : itemId}
        }, 
        { new: true, runValidators: true }
    )
    .then(UpdatedWishList => {
        res.status(200).json(UpdatedWishList)
    })
    .catch(err => {
        res.status(400).json(err)
    })
}

// DELETE
const deleteList = async (req, res) => {
    try{
        // find the parent
        const parent = await User.findOne({_id : req.body.parentId})
        // remove the wishlist from the parent wishLists
        const newWishlistList = parent.wishLists.filter(wishList => wishList._id != req.params.id)
        // update  the parent with the new list
        const updatedUser = await User.findByIdAndUpdate(req.body.parentId, {wishlists : newnewWishlistListRegList})
        // delete the list from the db
        const deletedList = await Wishlist.findByIdAndDelete(req.params.id)

        res.status(200).json({message: "Successful deletion", reg: deletedList})
    }catch (err){
        res.status(400).json(err)
    }}


module.exports = {
    createList,
    findAllLists,
    deleteList,
    addItem,
    removeItem,
    createChildList
}