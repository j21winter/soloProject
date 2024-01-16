const Item = require('../models/item.model')

const findFit = (req, res) => {

    const {height, weight} = req.params
    
    Item.find({
        $or: [
            { minWeight: { $lte: weight }, maxWeight: { $gte: weight } },
            { minHeight: { $lte: height }, maxHeight: { $gte: height } }
            ]
        })
        .then(itemList => {
            console.log(itemList)
            res.status(200).json(itemList)
        })
        .catch(err => res.status(400).json(err))
}

module.exports = {
    findFit
}