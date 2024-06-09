const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const formateurSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address',
    },
  },
  number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  cv: {
    data: {
      type: Buffer, // Storing file data as Buffer
      
    },
    contentType: String, // MIME type of the file
  },
});

// Static signup method
formateurSchema.statics.signup = async function (formData) {
  // Validation
  if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.number || !formData.domain) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(formData.email)) {
    throw Error('Invalid email address');
  }
  if (!formData.number || formData.number.length !== 8) {
    throw Error('Number must be 8 characters long');
  }
  if (!validator.isStrongPassword(formData.password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email: formData.email });
  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(formData.password, salt);

  const formateur = await this.create({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    number: formData.number,
    domain: formData.domain,
    password: hash,
    cv: {
      data: formData.cv.data,
      contentType: formData.cv.contentType,
    },
  });

  return formateur;
};

// Static login method
formateurSchema.statics.login = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const formateur = await this.findOne({ email });
  if (!formateur) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, formateur.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return formateur;
};

module.exports = mongoose.model('Formateur', formateurSchema);
