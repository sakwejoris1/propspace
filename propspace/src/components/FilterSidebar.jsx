import { useState } from 'react';

const FilterSidebar = ({ onFilter }) => {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');
  const [listingType, setListingType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ city, minPrice, maxPrice, type, listingType });
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setType('');
    setListingType('');
    onFilter({});
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">Filters</h3>
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-group">
          <label>City</label>
          <input
            type="text"
            placeholder="e.g. Douala"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="filter-group">
          <label>Min Price (FCFA)</label>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field"
            min="0"
          />
        </div>
        <div className="filter-group">
          <label>Max Price (FCFA)</label>
          <input
            type="number"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field"
            min="0"
          />
        </div>
        <div className="filter-group">
          <label>Property Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Listing Type</label>
          <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="input-field">
            <option value="">All</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full">Apply Filters</button>
        <button type="button" onClick={handleReset} className="btn-ghost w-full">Reset</button>
      </form>
    </aside>
  );
};

export default FilterSidebar;
