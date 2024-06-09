const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true })

module.exports = mongoose.model('categorie', categorieSchema)