const Registry = require('../models/registry.model')

// CREATE
const createReg = (req, res) => {
    Registry.create(req.body)
        .then(newReg => res.status(200).json(newReg))
        .catch(err => res.status(400).json(err))
}
// READ
const findAllReg = (req, res) => {
    Registry.find({parent: req.params.id})
        .then(regList => res.status(200).json(regList))
        .catch(err => res.status(400).json(err))
}
// UPDATE
// TODO how to add and remove items from a reg
// TODO Consider an on page out update and use the updated dom to update the db

// DELETE
const deleteReg = async (req, res) => {
    try{
        // find the parent
        const parent = await User.findOne({_id : req.body.parentId})
        // remove the child from the parent list
        const newRegList = parent.registries.filter(registry => registry._id != req.params.id)
        // update  the parent with the new list
        const updatedUser = await User.findByIdAndUpdate(req.body.parentId, {registries : newRegList})
        // delete the reg from the db
        const deletedReg = await Registry.findByIdAndDelete(req.params.id)

        res.status(200).json({message: "Successful deletion", reg: deletedReg})
    }catch (err){
        res.status(400).json(err)
    }}


module.exports = {
    createReg,
    findAllReg,
    deleteReg
}