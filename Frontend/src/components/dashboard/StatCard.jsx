function StatCard({ title, value, danger }) {
    return (
        <article className={danger ? "stat-card danger" : "stat-card"}>
            <p>{title}</p>
            <h3>
                {Number(value).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                })}
            </h3>
        </article>
    );
}

export default StatCard;