const categorie = require('../models/categorieModel')
const formation = require('../models/formationModel')
const User = require('../models/userModel');
const mongoose = require('mongoose')


//inscrire apprenant 
const Formation = require('../models/formationModel');

const inscrireUser = async (req, res) => {
  try {
    const { userId, formationId } = req.body;
    console.log(userId);
    const user = await User.findById(userId);
    
    const formation = await Formation.findById(formationId);

    if (!user || !formation) {
      return res.status(404).json({ message: 'User or Formation not found' });
    }

    user.formations.push(formationId);
    formation.users.push(userId);

    await user.save();
    await formation.save();

    res.status(200).json({ message: 'User successfully enrolled in formation' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const desinscrireUser = async (req, res) => {
  try {
    const { userId, formationId } = req.body;
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!user || !formation) {
      return res.status(404).json({ message: 'User or Formation not found' });
    }

    user.formations.pull(formationId);
    formation.users.pull(userId);

    await user.save();
    await formation.save();

    res.status(200).json({ message: 'User successfully unenrolled from formation' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserFormations = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('formations');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFormationUsers = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.formationId).populate('users');
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    res.status(200).json(formation.users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get all formations
const getformations = async (req, res) => {
  const formations = await formation.find({}).sort({createdAt: -1})

  res.status(200).json(formations)
}

// get a single formation// get a single formation
const getformation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such formation'})
  }

  const foundFormation = await formation.findById(id)

  if (!foundFormation) {
    return res.status(404).json({error: 'No such formation'})
  }
  
  res.status(200).json(foundFormation)
}



// create new formation
const createformation = async (req, res) => {
  console.log(req.body); // Log the request body to check the received data

  // Find the category based on the provided categorieId
  try {
    const category = await categorie.findById(req.body.categorie);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Add formation to the database with the found category
    const newFormation = await formation.create({ title: req.body.title,
      categorie: req.body.categorie, // Ensure it's the ID and not the title
      duree: parseInt(req.body.duree),
      datedebut: new Date(req.body.datedebut), // Ensure the date is in correct format
      datefin: new Date(req.body.datefin) // Ensure the date is in correct format
    });
     res.status(200).json(newFormation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// delete a formation
const deleteformation = async (req, res) => {
  const { id } = req.params;
  console.log('Formation ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such formation' });
  }

  try {
    const deletedFormation = await formation.findByIdAndDelete(id);

    if (!deletedFormation) {
      return res.status(400).json({ error: 'No such formation' });
    }

    res.status(200).json(deletedFormation);
  } catch (error) {
    // Handle any errors that occur during the deletion process
    res.status(500).json({ error: 'Internal server error' });
  }
}


// update a formation
const updateformation = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such formation'})
  }

  const formation = await formation.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!formation) {
    return res.status(400).json({error: 'No such formation'})
  }

  res.status(200).json(formation)
}


module.exports = {
  inscrireUser,
  desinscrireUser,
  getUserFormations,
  getFormationUsers,
  getformations,
  getformation,
  createformation,
  deleteformation,
  updateformation
}