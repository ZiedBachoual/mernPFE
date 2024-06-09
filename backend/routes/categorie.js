const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createcategorie,
  getcategories,
  getcategorie,
  deletecategorie,
  updatecategorie,
} = require("../controllers/categorieController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Exiger l'authentification pour toutes les routes de catégorie
//router.use(requireAuth);
const uploadDir = path.join(__dirname, '../uploads/images');
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
// GET toutes les catégories
router.get("/", getcategories);

// GET une seule catégorie
router.get("/:id", getcategorie);

// POST une nouvelle catégorie
router.post("/add", upload.single('image'), createcategorie);

// DELETE une catégorie
router.delete("/:id", deletecategorie);

// UPDATE une catégorie
router.patch("/:id", updatecategorie);

module.exports = router;
