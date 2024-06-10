const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seanceSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        heureDebut: {
            type: String,
            required: true
        },
        duree: {
            type: Number,
            required: true
        },
        lieu: {
            type: String,
            required: true
        },
        contenu: {
            type: String,
            required: false
        },
        formations: [{ type: Schema.Types.ObjectId, ref: 'Formation' }]
    },
    { timestamps: true });

const Seance = mongoose.model('Seance', seanceSchema);

module.exports = Seance;
