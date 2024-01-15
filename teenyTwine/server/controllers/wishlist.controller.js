const Wishlist = require('../models/wishlist.model')

// CREATE
const createList = (req, res) => {
    Wishlist.create(req.body)
        .then(newList => res.status(200).json(newList))
        .catch(err => res.status(400).json(err))
}
// READ
const findAllLists = (req, res) => {
    Wishlist.find({parent: req.params.parentId})
        .then(allWishlists => res.status(200).json(allWishlists))
        .catch(err => res.status(400).json(err))
}
// UPDATE
// TODO how to add and remove items from a list
// TODO Consider an on page out update and use the updated dom to update the db

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
    deleteList
}