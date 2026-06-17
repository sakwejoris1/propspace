import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PropSpace</Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Browse</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">My Listings</Link>
            <Link to="/properties/new" className="nav-link btn-primary-sm">+ List Property</Link>
            <Link to="/profile" className="nav-link">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} className="nav-avatar" />
                : <span className="nav-avatar-placeholder">{user.username[0].toUpperCase()}</span>
              }
            </Link>
            <button onClick={handleLogout} className="btn-ghost-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
