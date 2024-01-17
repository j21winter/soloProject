const WishlistController = require('../controllers/wishlist.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = app => {
    app.post('/api/wishlist/new', authenticate, WishlistController.createList )
    app.get('/api/wishlist/:parentId',authenticate, WishlistController.findAllLists)
    app.delete('/api/wishlist/:id', authenticate, WishlistController.deleteList)
    app.patch('/api/wishlist/add/:wishListId/:itemId', authenticate, WishlistController.addItem)
    app.patch('/api/wishlist/remove/:wishListId/:itemId', authenticate, WishlistController.removeItem)
}