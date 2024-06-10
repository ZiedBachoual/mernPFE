const Seance = require('../models/seanceModel');
const Formation = require('../models/formationModel');
const getAllSeances = async (req, res) => {
    try {
        const seances = await Seance.find();
        res.status(200).json(seances);
    } catch (error) {
        console.error('Error in getAllSeances:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const addSeanceToFormation = async (req, res) => {
    const {formationId, title, date, heureDebut, duree, lieu, contenu} = req.body;
    const formation = await Formation.findById(formationId);
    try {
        const seance = new Seance({
            title,
            date,
            heureDebut,
            duree,
            lieu,
            contenu,
            formations: [formationId]
        });
        await seance.save();
        const seanceId = seance._id;
        formation?.seances.push(seanceId);
        try {
            await formation.validateSync();
            await formation.save();
        } catch (e) {
            console.log(e)
        }
        res.status(201).json({message: 'Seance added successfully', seance});
    } catch (error) {
        console.error('Error in addSeanceToFormation:', error);
        res.status(400).json({error: error.message});
    }
};
const deleteSeance = async (req, res) => {
    const {seanceId, formationId} = req.body;
    try {
        console.log(seanceId)
        const formation = await Formation.findById(formationId);
        const seance = await Seance.findById(seanceId);
        if (!formation || !seance ) {
            return res.status(404).json({error: 'formation not found'});
        }
        formation?.seances.pull(seanceId);
        seance?.formations.pull(formationId);
        try {
            await formation.validateSync();
            await formation.save();
            await seance.validateSync();
            await seance.save();
        } catch (e) {
            console.log(e)
        }

        res.status(200).json({message: 'Seance deleted successfully'});
    } catch (error) {
        console.error('Error in deleteSeance:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {getAllSeances, addSeanceToFormation, deleteSeance};
