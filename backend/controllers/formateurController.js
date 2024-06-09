const Formateur = require('../models/formateurModel');
const Formation = require('../models/formationModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Function to create a JWT token
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '8d'});
};

// Add Formateur function
const addFormateur = async (req, res) => {
    const {firstName, lastName, email, number, domain, password} = req.body;
    const cv = req.file;

    if (!password) {
        return res.status(400).json({error: 'Password is required'});
    }

    try {
        const existingFormateur = await Formateur.findOne({email});
        if (existingFormateur) {
            return res.status(400).json({error: 'Formateur already exists'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newFormateur = new Formateur({
            firstName,
            lastName,
            email,
            number,
            domain,
            password: hashedPassword,
            cv: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/cv', cv.filename)),
                contentType: cv.mimetype,
            },
        });

        await newFormateur.save();

        const token = createToken(newFormateur._id);

        res.status(201).json({email: newFormateur.email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// Login Formateur function
const loginFormateur = async (req, res) => {
    const {email, password} = req.body;

    try {
        console.log('Login attempt with email:', email);

        // Find the formateur by email
        const formateur = await Formateur.findOne({email});
        if (!formateur) {
            console.log('Formateur not found');
            return res.status(400).json({error: 'Invalid email or password'});
        }

        // Compare the provided password with the stored hashed password
        const match = await bcrypt.compare(password, formateur.password);
        if (!match) {
            console.log('Password mismatch');
            return res.status(400).json({error: 'Invalid email or password'});
        }

        // Create a token
        const token = createToken(formateur._id);
        console.log('Login successful, token created:', token);

        // Return the formateur's email and token
        res.status(200).json({email: formateur.email, token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

// Get all Formateurs function
const getAllFormateurs = async (req, res) => {
    try {
        console.log("Fetching all formateurs...");
        const formateurs = await Formateur.find({});
        console.log("Formateurs fetched:", formateurs);
        res.status(200).json(formateurs);
    } catch (error) {
        console.error("Error fetching formateurs:", error);
        res.status(400).json({error: error.message});
    }
};

const addFormateurToFormation = async (req, res) => {
    const {formateurId, formationId} = req.body;

    try {
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({error: 'Formation not found'});
        }

        const formateur = await Formateur.findById(formateurId);
        if (!formateur) {
            return res.status(404).json({error: 'Formateur not found'});
        }

        if (formation.formateurs.includes(formateurId)) {
            return res.status(400).json({error: 'Formateur already added to the formation'});
        }

        formation.formateurs.push(formateurId);
        formateur.formations.push(formationId);
        try {
            await formation.validateSync();
            await formation.save();
        } catch (error) {
            res.status(200).json({message: 'error', error});
        }
        await formateur.save();
        res.status(200).json({message: 'Formateur added to formation', formation});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const removeFormateurFromFormation = async (req, res) => {
    const {formateurId, formationId} = req.body;

    try {
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({error: 'Formation not found'});
        }

        const formateur = await Formateur.findById(formateurId);
        if (!formateur) {
            return res.status(404).json({error: 'Formateur not found'});
        }

        if (!formation.formateurs.includes(formateurId)) {
            return res.status(400).json({error: 'Formateur not enrolled in the formation'});
        }

        formateur.formations.pull(formationId);
        formation.formateurs.pull(formateurId);
        try {
            await formation.validateSync();
            await formation.save();
        } catch (error) {
            res.status(200).json({message: 'error', error});
        }
        await formateur.save();
        res.status(200).json({message: 'Formateur removed from formation', formation});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    addFormateur,
    loginFormateur,
    getAllFormateurs,
    removeFormateurFromFormation,
    addFormateurToFormation
};
