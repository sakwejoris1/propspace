const InputField = ({ label, error, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
    {error && <span className="input-error-msg">{error}</span>}
  </div>
);

export default InputField;
