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
        console.log(req.body.parent)
        // Create + save new wishlist for the child
        const newWishList = await WishlistController.createChildList({
            title: newChild.name,
            child: newChild._id,
            parent: req.body.parent,
        })
        console.log("BACK IN CHILD")
        console.log(newWishList)

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
        res.status(400).json({success: false, error: err.message })
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

    try{
        // delete the child from the DB
        const deletedChild = await Child.findByIdAndDelete({_id : child._id})
        // delete the wishlist associated with the child
        const deletedWishlist = await Wishlist.findOneAndDelete({title: child.name, child: child._id})
        // Update the parent child and wishlist arrays by pulling specific objects
        const updatedParent = await User.findByIdAndUpdate(
            {_id: req.params.parentId}, 
            {
                $pull : {children: deletedChild._id, wishlists: deletedWishlist._id}
            },
            { new: true, runValidators: true }
        )

        res.status(200).json({success:true, deletedChild: deletedChild, deletedWishlist: deletedWishlist, updatedUser: updatedParent})
    } catch (err) {
        res.status(400).json({success:false, error: err})
    }
}

        // // find the parent
        // const parent = await User.findOne({_id : req.params.parentId})
        // // remove the child from the parent list
        // const newChildrenList = parent.children.filter(child => child._id != req.params.childId)
        // // update  the parent with the new list
        // const updatedUser = await User.findByIdAndUpdate(req.params.parentId, {children : newChildrenList})
        // // delete the child from the db
        // const deletedChild = await Child.findByIdAndDelete(req.params.childId)
        // const deletedWishlist = await WishlistController.findOneAndDelete()

    //     res.status(200).json({message: "Successful deletion", child: deletedChild})
    // }catch (err){
    //     res.status(400).json(err)
    // }}

module.exports = {
    addChild,
    updateChild, 
    findChildren,
    findOneChild,
    deleteOne
}