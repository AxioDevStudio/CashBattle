function SummaryCards({ income, expense, saving, formatMoney }) {
    return (
        <section className="clean-stats-grid">
            <article>
                <p>Renda</p>
                <strong>{formatMoney(income)}</strong>
            </article>

            <article>
                <p>Gastos</p>
                <strong className="danger">{formatMoney(expense)}</strong>
            </article>

            <article>
                <p>Guardado</p>
                <strong>{formatMoney(saving)}</strong>
            </article>
        </section>
    );
}

export default SummaryCards;
