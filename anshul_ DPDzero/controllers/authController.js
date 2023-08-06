const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, full_name, age, gender } = req.body;
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_REQUEST',
        message: 'Invalid request. Please provide all required fields: username, email, password, full_name.',
      });
    }

    // Check if the username or email already exists
    const userExists = await User.exists({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        code: userExists.username === username ? 'USERNAME_EXISTS' : 'EMAIL_EXISTS',
        message: userExists.username === username ? 'The provided username is already taken. Please choose a different username.' : 'The provided email is already registered. Please use a different email address.',
      });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_PASSWORD',
        message: 'The provided password does not meet the requirements. Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters, numbers, and special characters.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
      age,
      gender,
    });
    await user.save();

    return res.status(201).json({
      status: 'success',
      message: 'User successfully registered!',
      data: {
        user_id: user._id,
        username,
        email,
        full_name,
        age,
        gender,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        code: 'MISSING_FIELDS',
        message: 'Missing fields. Please provide both username and password.',
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. The provided username or password is incorrect.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. The provided username or password is incorrect.',
      });
    }

const token = jwt.sign({ user_id: user._id, username: user.username }, config.jwtSecret, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  return res.status(200).json({
    status: 'success',
    message: 'Access token generated successfully.',
    data: {
      access_token: token,
      expires_in: 3600,
    },
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred. Please try again later.',
  });
}
};

function isValidPassword(password) {
  return password.length >= 8;
}
