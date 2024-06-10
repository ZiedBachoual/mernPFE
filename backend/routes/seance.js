const express = require('express')
const mongoose = require("mongoose");

const { addSeanceToFormation,getAllSeances,deleteSeance} = require('../controllers/seanceController')

const router = express.Router()
router.post('/addseancetoformation', addSeanceToFormation)
router.get('/getallseances', getAllSeances)
router.post('/deleteseance', deleteSeance)


module.exports = router;