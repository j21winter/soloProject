const WishlistController = require('../controllers/wishlist.controller')

module.exports = app => {
    app.post('/api/wishlist/new', WishlistController.createList )
    app.get('/api/wishlist/:parentId', WishlistController.findAllLists)
    app.delete('/api/wishlist/:id', WishlistController.deleteList)
}