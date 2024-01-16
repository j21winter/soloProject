const ItemController = require('../controllers/item.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = app => {
    app.get('/api/items/:height/:weight', authenticate, ItemController.findFit)
}