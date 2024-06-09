  const categorie = require('../models/categorieModel');
  const mongoose = require('mongoose');
  const fs = require('fs');
  const path = require('path');

  // Obtenir toutes les catégories
  const getcategories = async (req, res) => {
    try {
      const categories = await categorie.find({}).sort({ createdAt: -1 });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  };

  // Obtenir une seule catégorie
  const getcategorie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Aucune catégorie correspondante' });
    }

    try {
      const categorie = await categorie.findById(id);

      if (!categorie) {
        return res.status(404).json({ error: 'Aucune catégorie correspondante' });
      }

      res.status(200).json(categorie);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
    }
  };

  // Créer une nouvelle catégorie
  const createcategorie = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file;

    if (!title || !description || !image) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    try {
      const imagePath = path.join(uploadDir, image.filename);
      const newcategorie = await categorie.create({
        title,
        description,
        image: {
          data: fs.readFileSync(imagePath),
          contentType: image.mimetype,
        },
      });
      res.status(201).json(newcategorie);
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
  };
  // Supprimer une catégorie
  const deletecategorie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Aucune catégorie correspondante' });
    }

    try {
      const deletedcategorie = await categorie.findOneAndDelete({ _id: id });

      if (!deletedcategorie) {
        return res.status(404).json({ error: 'Aucune catégorie correspondante' });
      }

      res.status(200).json(deletedcategorie);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
  };

  // Mettre à jour une catégorie
  const updatecategorie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Aucune catégorie correspondante' });
    }

    try {
      const updatedcategorie = await categorie.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedcategorie) {
        return res.status(404).json({ error: 'Aucune catégorie correspondante' });
      }

      res.status(200).json(updatedcategorie);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
    }
  };

  module.exports = {
    getcategories,
    getcategorie,
    createcategorie,
    deletecategorie,
    updatecategorie
  };
