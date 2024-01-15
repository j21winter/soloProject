const User = require('../models/user.model');
const Child = require('../models/child.model');

// CREATE 
// ensure the user id is already in the form
const addChild = async (req,res) => {
    try{
        // Save new child
        const newChild = await Child.create(req.body)

        // find parent/user and add child _id to children list
        const parent = await User.findOne({_id : req.body.parent})

        // ADD CHILD OBJECT TO PARENT CHILDREN LIST
        parent.children.push(newChild._id)

        // update parent with new child in children list
        const updatedUser = await User.findByIdAndUpdate( parent._id, parent, {new: true, runValidators: true})

        // return confirmation
        res.status(200).json({message: "Successful! ", data : updatedUser, child: newChild})
    } catch (err) {
        res.status(400).json({success: false, message:err.message})
    }
}
// READ
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
                $set: req.body, // update other fields
                $push: { history: historicValue }, // push to the history array
            },
            { new: true, runValidators: true }
        ).lean();

        res.status(200).json({ success: true, data: updatedChild });
        } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// DELETE
const deleteOne = async (req, res) => {
    // Should I Update the parent children list?
    try{
        // find the parent
        const parent = await User.findOne({_id : req.body.parentId})
        // remove the child from the parent list
        const newChildrenList = parent.children.filter(child => child._id != req.params.id)
        // update  the parent with the new list
        const updatedUser = await User.findByIdAndUpdate(req.body.parentId, {children : newChildrenList})
        // delete the child from the db
        const deletedChild = await Child.findByIdAndDelete(req.params.id)

        res.status(200).json({message: "Successful deletion", child: deletedChild})
    }catch (err){
        res.status(400).json(err)
    }}

module.exports = {
    addChild,
    updateChild, 
    findChildren,
    deleteOne
}