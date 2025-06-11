const express = require('express')
const { loginController, registerController } = require('../controllers/userController')


//router object
const router = express.Router()

//routers
//POST for LOGIN
router.post('/login',loginController)

//POST for register user
router.post('/register',registerController)

module.exports = router