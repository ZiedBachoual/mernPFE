const express = require('express')

// controller functions
const { loginUser, signupUser, RequestReset, ResetPassword, getUserFormations } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)
//mes formations 
router.get('/:userId/formations', getUserFormations);

// signup route
router.post('/signup', signupUser)

//Reset Pwd 
router.post('/request-password-reset', RequestReset);
router.post('/reset-password', ResetPassword);

module.exports = router;