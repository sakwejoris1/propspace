const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existing = await UserRepository.findByEmailOrUsername(email, username);
  if (existing) {
    return res.status(400).json({ message: 'Email or username already in use' });
  }

  const user = await UserRepository.create({ username, email, password });
  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: { _id: user._id, username: user.username, email: user.email, phone: user.phone, avatar: user.avatar },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await UserRepository.findByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id);

  res.status(200).json({
    token,
    user: { _id: user._id, username: user.username, email: user.email, phone: user.phone, avatar: user.avatar },
  });
};

module.exports = { register, login };
