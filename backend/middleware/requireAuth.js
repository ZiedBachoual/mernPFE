const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Formateur = require('../models/formateurModel'); // Import Formateur model

const requireAuth = async (req, res, next) => {
  // Verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify the token and extract the _id and role
    const { _id, role } = jwt.verify(token, process.env.SECRET);
    console.log('Token verified:', { _id, role }); // Debug logging

    let user;
    // Find user based on role
    if (role === 'user' || role === 'admin') {
      user = await User.findOne({ _id }).select('_id');
      console.log('User found:', user); // Debug logging
    } else if (role === 'formateur') {
      user = await Formateur.findOne({ _id }).select('_id');
      console.log('Formateur found:', user); // Debug logging
    }

    // If no user is found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
