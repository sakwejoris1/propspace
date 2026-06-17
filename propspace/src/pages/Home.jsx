import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await axiosInstance.get(`/properties?${params.toString()}`);
      setProperties(data);
    } catch {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    return () => {};
  }, []);

  return (
    <div className="page-layout">
      <FilterSidebar onFilter={fetchProperties} />
      <main className="properties-main">
        <h1 className="page-title">Browse Properties</h1>
        {loading && (
          <div className="state-container">
            <div className="spinner" />
            <p>Loading properties...</p>
          </div>
        )}
        {!loading && error && (
          <div className="state-container error-state">
            <p>{error}</p>
            <button onClick={() => fetchProperties()} className="btn-primary">Retry</button>
          </div>
        )}
        {!loading && !error && properties.length === 0 && (
          <div className="state-container">
            <p className="empty-msg">No properties found matching your criteria.</p>
          </div>
        )}
        {!loading && !error && properties.length > 0 && (
          <div className="properties-grid">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} isOwner={false} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
