const RegController = require('../controllers/registry.controller')

module.exports = app => {
    app.post('/api/reg/new', RegController.createReg)
    app.get('/api/reg/:parentId', RegController.findAllReg)
    app.delete('/apo/reg/:id', RegController.deleteReg)
}