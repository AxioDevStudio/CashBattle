function RankingCard({ position, name, xp }) {
    return (
        <article className="ranking-card">
            <strong>{position}</strong>
            <div>
                <h4>{name}</h4>
                <p>{xp}</p>
            </div>
        </article>
    );
}

export default RankingCard;
