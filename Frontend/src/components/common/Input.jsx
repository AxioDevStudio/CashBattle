function Input({ label, error, ...props }) {
    return (
        <label className="form-field">
            {label && <span>{label}</span>}
            <input {...props} />
            {error && <small>{error}</small>}
        </label>
    );
}

export default Input;
