const Input = ({ type, name, value, handleChange, error }) => (
    <>
      <input type={type} name={name} value={value} onChange={handleChange} className={error ? 'input-error' : ''} />
      {error && <span className="error">{error}</span>}
    </>
  );
  
  export default Input;
  