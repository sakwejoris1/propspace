import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import InputField from '../components/InputField';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [keepExisting, setKeepExisting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/properties/${id}`);
        if (!cancelled) {
          setForm({
            title: data.title,
            description: data.description,
            price: String(data.price),
            city: data.location.city,
            country: data.location.country,
            type: data.type,
            listingType: data.listingType,
          });
          setExistingImages(data.imageUrls || []);
        }
      } catch {
        if (!cancelled) setApiError('Property not found or you are not authorized.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id]);

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

  const removeNewImage = (idx) => {
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

    setSaving(true);
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
      formData.append('keepExistingImages', String(keepExisting));
      imageFiles.forEach((f) => formData.append('images', f));

      await axiosInstance.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="state-container"><div className="spinner" /><p>Loading...</p></div>;
  if (!form) return <div className="state-container error-state"><p>{apiError}</p></div>;

  return (
    <div className="form-page-container">
      <h1 className="page-title">Edit Listing</h1>
      {apiError && <div className="alert-error">{apiError}</div>}
      <form onSubmit={handleSubmit} noValidate className="property-form">
        <InputField label="Title" type="text" name="title" value={form.title} onChange={handleChange} error={errors.title} />
        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`input-field textarea ${errors.description ? 'input-error' : ''}`}
            rows={4}
          />
          {errors.description && <span className="input-error-msg">{errors.description}</span>}
        </div>
        <InputField label="Price (FCFA)" type="number" name="price" value={form.price} onChange={handleChange} min="0" error={errors.price} />
        <div className="form-row">
          <InputField label="City" type="text" name="city" value={form.city} onChange={handleChange} error={errors.city} />
          <InputField label="Country" type="text" name="country" value={form.country} onChange={handleChange} error={errors.country} />
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

          {existingImages.length > 0 && (
            <div className="existing-images-section">
              <p className="existing-label">Current images:</p>
              <div className="image-previews">
                {existingImages.map((src, i) => (
                  <div key={i} className="preview-item">
                    <img src={src} alt={`existing ${i + 1}`} />
                  </div>
                ))}
              </div>
              <label className="keep-existing-label">
                <input
                  type="checkbox"
                  checked={keepExisting}
                  onChange={(e) => setKeepExisting(e.target.checked)}
                />
                Keep existing images when adding new ones
              </label>
            </div>
          )}

          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const selected = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
              setImageFiles(selected);
              setPreviews(selected.map(f => URL.createObjectURL(f)));
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
            <p className="upload-text">{imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to add new images or drag & drop'}</p>
            <p className="upload-hint">PNG, JPG, WEBP up to 5MB each</p>
          </div>

          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((src, i) => (
                <div key={i} className="preview-item">
                  <img src={src} alt={`new ${i + 1}`} />
                  <button type="button" className="preview-remove" onClick={() => removeNewImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
