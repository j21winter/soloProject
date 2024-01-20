const Wishlist = require('../models/wishlist.model')
const User = require('../models/user.model')

// CREATE
const createList = async (req, res) => {
    console.log(req.body)
    const {parent} = req.body
    try{
        // create the new wishlist
        const newWishlist = await Wishlist.create(req.body)

        // attach it to the user
        const updatedParent = await User.findOneAndUpdate(
            {_id : parent},
            {
                $push : {wishlists: newWishlist._id}
            },
            {new: true, runValidators: true}
        )

        res.status(200).json({newWishlist: newWishlist, updatedUser: updatedParent})
    } catch (err) {
        res.status(400).json(err)
    }
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
    console.log("ADDING ITEM")
    const {itemId, wishListId} = req.params
    Wishlist.findOneAndUpdate(
        {_id : wishListId}, 
        {
            $push: {items : itemId}
        },
        { new: true, runValidators: true }
    ).populate('items').populate('child')
    .then(UpdatedWishList => {
        res.status(200).json(UpdatedWishList, )
    })
    .catch(err => {
        res.status(400).json(err)
    })
}

const removeItem = (req, res) => {
    const {itemId, wishListId} = req.params
    Wishlist.findOneAndUpdate(
        {_id : wishListId}, 
        {
            $pull : {items : itemId}
        }, 
        { new: true, runValidators: true }
    ).populate('items').populate('child')
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
        const deletedList = await Wishlist.findByIdAndDelete(req.params.id)
        // find the parent
        const updatedParent = await User.findOneAndUpdate(
            {_id : req.body.parentId}, 
            {
                $pull : {wishlists: req.params.id}
            }, 
            {new: true, runValidators: true}
        )

        res.status(200).json({message: "Successful deletion", deletedList, updatedParent})
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