function StatisticsCard({ title, value }) {
    return (
        <article className="statistic-card">
            <p>{title}</p>
            <strong>{value}</strong>
        </article>
    );
}

export default StatisticsCard;
