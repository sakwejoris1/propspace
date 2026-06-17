import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/properties/${id}`);
        if (!cancelled) setProperty(data);
      } catch {
        if (!cancelled) setError('Property not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axiosInstance.delete(`/properties/${id}`);
      navigate('/dashboard');
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  if (loading) return <div className="state-container"><div className="spinner" /><p>Loading...</p></div>;
  if (error || !property) return (
    <div className="state-container error-state">
      <p>{error || 'Property not found.'}</p>
      <Link to="/" className="btn-primary">Back to Browse</Link>
    </div>
  );

  const isOwner = user && property.owner?._id === user._id;
  const images = property.imageUrls || [];

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="btn-ghost back-btn">← Back</button>

      <div className="detail-gallery">
        {images.length > 0 ? (
          <>
            <img src={images[imgIdx]} alt={property.title} className="detail-main-img" />
            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className={`detail-thumb ${i === imgIdx ? 'active' : ''}`}
                    onClick={() => setImgIdx(i)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="detail-no-img">No images available</div>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-header">
          <div>
            <h1 className="detail-title">{property.title}</h1>
            <p className="detail-location">{property.location.city}, {property.location.country}</p>
          </div>
          <div className="detail-price-block">
            <span className="detail-price">{property.price.toLocaleString()} FCFA</span>
            <span className={`badge badge-${property.listingType}`}>{property.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
          </div>
        </div>

        <div className="detail-badges">
          <span className="badge badge-type">{property.type}</span>
        </div>

        <p className="detail-description">{property.description}</p>

        <div className="detail-owner">
          <strong>Listed by:</strong>{' '}
          {property.owner?.avatar && <img src={property.owner.avatar} alt="" className="owner-avatar" />}
          {property.owner?.username}
        </div>

        {isOwner && (
          <div className="detail-owner-actions">
            <button onClick={() => navigate(`/properties/${id}/edit`)} className="btn-primary">Edit</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
