import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onDelete, onEdit, isOwner }) => {
  const { _id, title, price, location, type, listingType, imageUrls } = property;

  return (
    <div className="property-card">
      <div className="property-card-img">
        {imageUrls?.[0]
          ? <img src={imageUrls[0]} alt={title} />
          : <div className="property-card-img-placeholder"><span>No Image</span></div>
        }
        <span className={`badge badge-${listingType}`}>{listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>
      </div>
      <div className="property-card-body">
        <h3 className="property-card-title">{title}</h3>
        <p className="property-card-location">{location.city}, {location.country}</p>
        <div className="property-card-meta">
          <span className="badge badge-type">{type}</span>
          <span className="property-card-price">{price.toLocaleString()} FCFA</span>
        </div>
        <div className="property-card-actions">
          <Link to={`/properties/${_id}`} className="btn-outline-sm">View Details</Link>
          {isOwner && (
            <>
              <button onClick={() => onEdit(_id)} className="btn-ghost-sm">Edit</button>
              <button onClick={() => onDelete(_id)} className="btn-danger-sm">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
