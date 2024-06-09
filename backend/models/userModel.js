const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isStrongPassword(value, { minLength: 8 }),
      message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin']
  },
  telephone: {
    type: String,
    required: true,
    validate: [validator.isMobilePhone, 'Invalid phone number']
  },
  adresse: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    required: true,
    enum: ['etudiant', 'demandeur d\'emploi', 'employé']
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  formations: [{ type: Schema.Types.ObjectId, ref: 'Formation' }]
});

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

userSchema.statics.signup = async function(nom, prenom, email, password, role, telephone, adresse, niveau) {
  if (!nom || !prenom || !email || !password || !role || !telephone || !adresse || !niveau) {
    throw Error('All fields must be filled');
  }
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw Error('Email already in use');
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await this.create({ nom, prenom, email, password: hash, role, telephone, adresse, niveau });
  return user;
};

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
