function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <section className="modal-card" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose}>×</button>
                </div>

                {children}
            </section>
        </div>
    );
}

export default Modal;
