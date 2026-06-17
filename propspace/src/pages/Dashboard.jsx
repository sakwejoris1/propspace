import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get('/properties/my');
        if (!cancelled) setProperties(data);
      } catch {
        if (!cancelled) setError('Failed to load your listings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axiosInstance.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete. Please try again.');
    }
  };

  const handleEdit = (id) => navigate(`/properties/${id}/edit`);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Listings</h1>
        <button onClick={() => navigate('/properties/new')} className="btn-primary">
          + New Listing
        </button>
      </div>
      {loading && (
        <div className="state-container">
          <div className="spinner" />
          <p>Loading your listings...</p>
        </div>
      )}
      {!loading && error && (
        <div className="state-container error-state">
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && properties.length === 0 && (
        <div className="state-container">
          <p className="empty-msg">You haven&apos;t listed any properties yet.</p>
          <button onClick={() => navigate('/properties/new')} className="btn-primary">
            List Your First Property
          </button>
        </div>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="properties-grid">
          {properties.map((p) => (
            <PropertyCard
              key={p._id}
              property={p}
              isOwner
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
