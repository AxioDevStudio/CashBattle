import NetWorthCard from "./NetWorthCard";

function BalanceCard(props) {
    if (props.netWorth !== undefined || props.saved !== undefined) {
        return <NetWorthCard {...props} />;
    }

    const format = props.formatMoney || ((val) => Number(val || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
    const percent = Number(props.percent || 0);

    return (
        <section className="balance-clean-card">
            <p>Saldo disponível</p>
            <h2>{format(props.balance)}</h2>
            <span>{percent.toFixed(0)}% da sua meta mensal foi concluída.</span>

            <div className="progress-bar">
                <div style={{ width: `${Math.min(percent, 100)}%` }}></div>
            </div>

            <small>Faltam {format(props.remaining)} para alcançar sua meta.</small>
        </section>
    );
}

export { NetWorthCard };
export default BalanceCard;
