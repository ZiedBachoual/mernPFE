const express = require('express')

// controller functions
const { loginUser, signupUser, RequestReset, ResetPassword, getUserFormations, enrollUserToFormation, unenrollUserFromFormation,getAllUsers } = require('../controllers/userController')

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

//enroll and uneroll user from formations

router.post('/enroll', enrollUserToFormation);
router.post('/unenroll', unenrollUserFromFormation);

router.get('/getallusers', getAllUsers);


module.exports = router;