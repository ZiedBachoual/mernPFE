const User = require('../models/userModel');
const Formation = require('../models/formationModel');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('./mailer');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' });
};

const RequestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    user.generatePasswordReset();
    await user.save();

    await sendResetEmail(user.email, user.resetPasswordToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in RequestReset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in ResetPassword:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token, role: user.role,user});
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { nom, prenom, email, password, role, telephone, adresse, niveau } = req.body;

  try {
    const user = await User.signup(nom, prenom, email, password, role, telephone, adresse, niveau);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    console.error('Error in signupUser:', error);
    res.status(400).json({ error: error.message });
  }
};
const getUserFormations = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('formations');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.formations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const enrollUserToFormation = async (req, res) => {
  const { userId, formationId } = req.body;

  try {
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!user || !formation) {
      return res.status(404).json({ error: 'User or Formation not found' });
    }

    if (!user.formations.includes(formationId)) {
      user.formations.push(formationId);
      formation.users.push(userId);
    }

    await user.save();
    await formation.save();

    res.status(200).json({ message: 'User enrolled in formation successfully', user });
  } catch (error) {
    console.error('Error in enrollUserToFormation:', error);
    res.status(400).json({ error: error.message });
  }
};
const unenrollUserFromFormation = async (req, res) => {
  const { userId, formationId } = req.body;

  try {
    const user = await User.findById(userId);
    const formation = await Formation.findById(formationId);

    if (!user || !formation) {
      return res.status(404).json({ error: 'User or Formation not found' });
    }

    user.formations.pull(formationId);
    formation.users.pull(userId);

    await user.save();
    await formation.save();

    res.status(200).json({ message: 'User unenrolled from formation successfully', user });
  } catch (error) {
    console.error('Error in unenrollUserFromFormation:', error);
    res.status(400).json({ error: error.message });
  }
};
module.exports = { signupUser, loginUser, RequestReset, ResetPassword, getUserFormations , enrollUserToFormation, unenrollUserFromFormation};
