import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/properties/new" element={<ProtectedRoute><CreateProperty /></ProtectedRoute>} />
          <Route path="/properties/:id/edit" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
