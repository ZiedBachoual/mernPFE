const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  categorie: {type: Schema.Types.ObjectId,
    ref: 'Categorie',
    required: true
  },
  duree: {
    type: Number,
    required: true
  },
  datedebut: {
    type: Date,
    required: true
  },
  datefin: {
    type: Date,
    required: true
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
},
 { timestamps: true });

module.exports = mongoose.model('Formation', formationSchema);
