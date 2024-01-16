const ChildController = require('../controllers/child.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = app => {
    app.post('/api/child/new', authenticate, ChildController.addChild)
    app.get('/api/child/:id', authenticate, ChildController.findOneChild)
    app.get('/api/child/all/:parentId', authenticate, ChildController.findChildren)
    app.patch('/api/child/:id', authenticate, ChildController.updateChild)
    app.delete('/api/child/:childId/:parentId', authenticate, ChildController.deleteOne)
}