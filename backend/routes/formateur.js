const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Import controller functions for Formateur
const { loginFormateur, addFormateur, getAllFormateurs } = require('../controllers/formateurController');
const fs = require("fs");

const uploadDir = path.join(__dirname, '../uploads/cv');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
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
