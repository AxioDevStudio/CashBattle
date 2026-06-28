function BalanceCard({ balance, percent, remaining, formatMoney }) {
    return (
        <section className="balance-clean-card">
            <p>Saldo disponível</p>
            <h2>{formatMoney(balance)}</h2>
            <span>{percent.toFixed(0)}% da sua meta mensal foi concluída.</span>

            <div className="progress-bar">
                <div style={{ width: `${percent}%` }}></div>
            </div>

            <small>Faltam {formatMoney(remaining)} para alcançar sua meta.</small>
        </section>
    );
}

export default BalanceCard;
