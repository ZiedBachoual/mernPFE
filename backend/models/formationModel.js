const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formationSchema = new Schema({
        title: {
            type: String,
            required: false
        },
        categorie: {
            type: String,
            ref: 'Categorie',
            required: false
        },
        duree: {
            type: Number,
            required: false
        },
        datedebut: {
            type: Date,
            required: false
        },
        datefin: {
            type: Date,
            required: false
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
        formateurs: [{
            type: Schema.Types.ObjectId,
            ref: 'Formateur',
            required: true
        }],
    },
    { timestamps: true });

module.exports = mongoose.model('Formation', formationSchema);
