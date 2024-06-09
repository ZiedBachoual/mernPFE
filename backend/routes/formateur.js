const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Import controller functions for Formateur
const { loginFormateur, addFormateur, getAllFormateurs } = require('../controllers/formateurController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cv');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Login route for Formateur
router.post('/login', loginFormateur);

// Add route for Formateur
router.post('/add', upload.single('cv'), addFormateur);

// Get route to retrieve all formateurs
router.get('/', getAllFormateurs);

module.exports = router;
