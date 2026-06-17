import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import InputField from '../components/InputField';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNew: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const validateProfile = () => {
    const e = {};
    if (!profileForm.username.trim()) e.username = 'Username is required';
    return e;
  };

  const handleProfileChange = (e) => {
    setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setProfileErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) return setProfileErrors(errs);
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const { data } = await axiosInstance.put('/users/me', profileForm);
      updateUser(data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.oldPassword) e.oldPassword = 'Current password is required';
    if (!pwForm.newPassword) e.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 6) e.newPassword = 'Min 6 characters';
    if (pwForm.newPassword !== pwForm.confirmNew) e.confirmNew = 'Passwords do not match';
    return e;
  };

  const handlePwChange = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPwErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length) return setPwErrors(errs);
    setPwLoading(true);
    setPwMsg('');
    try {
      await axiosInstance.put('/users/me/password', {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Password change failed.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="page-title">Account Settings</h1>

      <div className="profile-section">
        <h2>Profile Information</h2>
        {profileMsg && <div className={profileMsg.includes('success') ? 'alert-success' : 'alert-error'}>{profileMsg}</div>}
        <form onSubmit={handleProfileSubmit} noValidate>
          <InputField
            label="Username"
            type="text"
            name="username"
            value={profileForm.username}
            onChange={handleProfileChange}
            error={profileErrors.username}
          />
          <InputField
            label="Phone Number"
            type="tel"
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
            placeholder="+1 555 0000"
            error={profileErrors.phone}
          />
          <InputField
            label="Avatar URL"
            type="url"
            name="avatar"
            value={profileForm.avatar}
            onChange={handleProfileChange}
            placeholder="https://..."
            error={profileErrors.avatar}
          />
          {profileForm.avatar && (
            <img src={profileForm.avatar} alt="avatar preview" className="avatar-preview" />
          )}
          <button type="submit" className="btn-primary" disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="profile-section">
        <h2>Change Password</h2>
        {pwMsg && <div className={pwMsg.includes('success') ? 'alert-success' : 'alert-error'}>{pwMsg}</div>}
        <form onSubmit={handlePwSubmit} noValidate>
          <InputField
            label="Current Password"
            type="password"
            name="oldPassword"
            value={pwForm.oldPassword}
            onChange={handlePwChange}
            placeholder="••••••••"
            error={pwErrors.oldPassword}
          />
          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            placeholder="Min 6 characters"
            error={pwErrors.newPassword}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmNew"
            value={pwForm.confirmNew}
            onChange={handlePwChange}
            placeholder="Repeat new password"
            error={pwErrors.confirmNew}
          />
          <button type="submit" className="btn-primary" disabled={pwLoading}>
            {pwLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
