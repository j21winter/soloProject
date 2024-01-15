const ChildController = require('../controllers/child.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = app => {
    app.post('/api/child/new', authenticate, ChildController.addChild)
    app.get('/api/child/:parentId', authenticate, ChildController.findChildren)
    app.patch('/api/child/:id', authenticate, ChildController.updateChild)
    app.delete('/api/child/:id', authenticate, ChildController.deleteOne)
}