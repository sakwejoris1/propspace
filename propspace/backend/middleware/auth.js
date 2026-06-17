const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const user = await UserRepository.findById(decoded.id);
  if (!user) return res.status(401).json({ message: 'User no longer exists' });

  req.user = user;
  next();
};

module.exports = { protect };
