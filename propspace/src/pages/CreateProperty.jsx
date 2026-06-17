import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import InputField from '../components/InputField';

const INITIAL = {
  title: '', description: '', price: '', city: '', country: 'Cameroon',
  type: 'Apartment', listingType: 'rent',
};

const CreateProperty = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setImageFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price) e.price = 'Price is required';
    else if (Number(form.price) < 0) e.price = 'Price must be positive';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.country.trim()) e.country = 'Country is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setApiError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('city', form.city);
      formData.append('country', form.country);
      formData.append('type', form.type);
      formData.append('listingType', form.listingType);
      imageFiles.forEach((f) => formData.append('images', f));

      await axiosInstance.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <h1 className="page-title">List a Property</h1>
      {apiError && <div className="alert-error">{apiError}</div>}
      <form onSubmit={handleSubmit} noValidate className="property-form">
        <InputField label="Title" type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Cozy 2BR Apartment" error={errors.title} />
        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the property..."
            className={`input-field textarea ${errors.description ? 'input-error' : ''}`}
            rows={4}
          />
          {errors.description && <span className="input-error-msg">{errors.description}</span>}
        </div>
        <InputField label="Price (FCFA)" type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 500000" min="0" error={errors.price} />
        <div className="form-row">
          <InputField label="City" type="text" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Douala" error={errors.city} />
          <InputField label="Country" type="text" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Cameroon" error={errors.country} />
        </div>
        <div className="form-row">
          <div className="input-group">
            <label className="input-label">Property Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field">
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Listing Type</label>
            <select name="listingType" value={form.listingType} onChange={handleChange} className="input-field">
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Property Images</label>
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dt = e.dataTransfer;
              if (dt.files.length) {
                const selected = Array.from(dt.files).filter(f => f.type.startsWith('image/'));
                setImageFiles(selected);
                setPreviews(selected.map(f => URL.createObjectURL(f)));
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden-file-input"
            />
            <div className="upload-icon">📷</div>
            <p className="upload-text">Click to select images or drag & drop</p>
            <p className="upload-hint">PNG, JPG, WEBP up to 5MB each · Max 10 images</p>
          </div>

          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((src, i) => (
                <div key={i} className="preview-item">
                  <img src={src} alt={`preview ${i + 1}`} />
                  <button
                    type="button"
                    className="preview-remove"
                    onClick={() => removeImage(i)}
                    title="Remove"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
