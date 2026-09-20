function MissionCard({ title, checked }) {
    return (
        <article className="mission-card">
            <span>{checked ? "✓" : "○"}</span>
            <p>{title}</p>
        </article>
    );
}

export default MissionCard;
