function StatCard({ title, value, danger }) {
    return (
        <article className="stat-card">
            <p>{title}</p>
            <strong className={danger ? "danger" : ""}>{value}</strong>
        </article>
    );
}

export default StatCard;
