const User = require('../models/user.model');
const Child = require('../models/child.model');
const WishlistController = require('../controllers/wishlist.controller')
const Wishlist = require('../models/wishlist.model')

// CREATE 
// ensure the user id is already in the form
const addChild = async (req,res) => {
    console.log(req.body)
    try{
        // Save new child
        const newChild = await Child.create(req.body)
        console.log(newChild)
        // Create + save new wishlist for the child
        const newWishList = await WishlistController.createChildList({
            title: (newChild.name),
            child: newChild._id,
            parent: req.body.parent,
        })

        newWishList.child = newChild

        // find parent/user and add child _id to children list
        const updatedUser = await User.findOneAndUpdate(
            {_id : req.body.parent}, 
            { 
                $push : { children: newChild._id, wishlists: newWishList}
            }, 
            { new: true, runValidators: true }
        )
        
        // return confirmation
        res.status(200).json({message: "Successful! ", parent : updatedUser, child: newChild, wishlist: newWishList})
    } catch (err) {
        res.status(400).json({success: false, error: err })
    }
}
// READ
const findOneChild = (req, res) => {
    Child.findOne({_id: req.params.id})
        .then(child => res.status(200).json(child))
        .catch(err => res.status(400).json(err))
}

const findChildren = (req, res) => {
    Child.find({parent : req.params.parentId})
        .then(children => res.status(200).json(children))
        .catch(err => console.log(err))
}

// UPDATE
// Update child info, create a history of the info before updating
const updateChild = async (req, res) => {
    try {
        // find current child info
        const currentChild = await Child.findOne({ _id: req.params.id });

        if (!currentChild) {
            return res.status(404).json({ success: false, message: 'Child not found' });
        }

        // destructure values we want to archive from the current child
        const { height, weight } = currentChild;

        // create object to store
        const historicValue = { height, weight, dateAdded: new Date() };

        // update specific fields including the history array using $set and $push
        const updatedChild = await Child.findOneAndUpdate(
            { _id: currentChild._id },
            { 
                $set: {height: req.body.height , weight: req.body.weight},// update other fields
                $push: { history: historicValue }, // push to the history array
            },
            { new: true, runValidators: true }
        ).lean();

        res.status(200).json({ success: true, child: updatedChild });
        } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// DELETE
const deleteOne = async (req, res) => {

    const {child} = req.body
    const {parentId} = req.params

    try{
        // delete the child from the DB
        const deletedChild = await Child.findByIdAndDelete({_id : child._id})

        // does the wishlist exist or has it been deleted?
        const wishlistExists = await Wishlist.findOne({title: child.name, child: child._id})

        if(wishlistExists){
            // delete the wishlist associated with the child
            const deletedWishlist = await Wishlist.findOneAndDelete({title: child.name, child: child._id})

            // update the parent too remove child and wishlist
            const updatedParent = await User.findByIdAndUpdate(
                {_id: req.params.parentId}, 
                {
                    $pull : {children: deletedChild._id, wishlists: deletedWishlist._id}
                },
                { new: true, runValidators: true }
            )
            // send response with deletedWishlist
            res.status(200).json({success:true, deletedChild, deletedWishlist, updatedParent})
        } else {
            // update the parent to remove only the child
            const updatedParent = await User.findByIdAndUpdate(
                {_id: req.params.parentId}, 
                {
                    $pull : {children: deletedChild._id}
                },
                { new: true, runValidators: true }
            )
            // send response without wishlist
            res.status(200).json({success:true, deletedChild, updatedParent})
        }

    } catch (err) {
        res.status(400).json({success:false, err})
    }
}

module.exports = {
    addChild,
    updateChild, 
    findChildren,
    findOneChild,
    deleteOne
}