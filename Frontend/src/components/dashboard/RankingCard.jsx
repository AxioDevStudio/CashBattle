function RankingCard({ position, name, xp, active }) {
    return (
        <article className={active ? "ranking-card active" : "ranking-card"}>
            <strong>{position}</strong>

            <div>
                <h4>{name}</h4>
                <p>{xp}</p>
            </div>
        </article>
    );
}

export default RankingCard;