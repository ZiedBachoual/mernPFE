const express = require("express");
const mongoose = require("mongoose");
const { inscrireUser, desinscrireUser, getUserFormations, getFormationUsers } = require('../controllers/formationController');
const {
  createformation,
  getformations,
  getformation,
  deleteformation,
  updateformation,
} = require("../controllers/formationController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post('/inscrire', inscrireUser);
router.post('/desinscrire', desinscrireUser);
router.get('/user/:userId/formations', getUserFormations);
router.get('/formation/:formationId/users', getFormationUsers);

// require auth for all formations routes
//router.use(requireAuth);

// GET all formations
router.get("/", getformations);

//GET a single formation
router.get("/:id", getformation);

// POST a new formation
router.post("/add", createformation);

// DELETE a formation
router.delete("/:id", deleteformation);

// UPDATE a formation
router.patch("/:id", updateformation);

module.exports = router;
