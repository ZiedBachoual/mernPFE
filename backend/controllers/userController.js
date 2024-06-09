const User = require('../models/userModel');
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
    res.status(200).json({ email, token, role: user.role });
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

module.exports = { signupUser, loginUser, RequestReset, ResetPassword, getUserFormations };
