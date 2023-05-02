const authController  = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const errorController = require('../controllers/errorController')


module.exports = (app) =>{
    app.use('/', homeController)
    app.use('/auth', authController)
    app.use('*', errorController)
}