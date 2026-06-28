import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

function TransactionType({ type, onChange }) {
    return (
        <section className="type-selector">
            <button
                type="button"
                className={type === "income" ? "active" : ""}
                onClick={() => onChange("income")}
            >
                <TrendingUp size={20} />
                Receita
            </button>

            <button
                type="button"
                className={type === "expense" ? "active danger" : ""}
                onClick={() => onChange("expense")}
            >
                <TrendingDown size={20} />
                Gasto
            </button>

            <button
                type="button"
                className={type === "saving" ? "active" : ""}
                onClick={() => onChange("saving")}
            >
                <PiggyBank size={20} />
                Guardar
            </button>
        </section>
    );
}

export default TransactionType;
