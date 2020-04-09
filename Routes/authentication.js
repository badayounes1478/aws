const express = require('express');
const router = express.Router()
const {signupController, loginController} = require('../controller/authentication')

//user getting created
router.post('/signup',signupController)

//user getting logged
router.post('/login',loginController)

module.exports = router