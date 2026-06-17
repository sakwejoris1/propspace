const UserRepository = require('../repositories/user.repository');

const getProfile = async (req, res) => {
  const user = await UserRepository.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  });
};

const updateProfile = async (req, res) => {
  const { username, phone, avatar } = req.body;
  const updates = {};

  if (username !== undefined) {
    if (!username.trim()) return res.status(400).json({ message: 'Username cannot be empty' });
    updates.username = username.trim();
  }
  if (phone !== undefined) updates.phone = phone;
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await UserRepository.updateById(req.user._id, updates);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await UserRepository.findByIdWithPassword(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await user.comparePassword(oldPassword);
  if (!match) return res.status(401).json({ message: 'Old password is incorrect' });

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};

module.exports = { getProfile, updateProfile, changePassword };
