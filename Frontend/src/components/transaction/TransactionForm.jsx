import MoneyInput from "./MoneyInput";

function TransactionForm({
    type,
    amount,
    setAmount,
    category,
    setCategory,
    description,
    setDescription,
    categories,
    goals = [],
    goalId,
    setGoalId,
    error,
    loading,
    onSubmit
}) {
    return (
        <form className="transaction-card" onSubmit={onSubmit}>
            <label>Valor</label>
            <MoneyInput value={amount} onChange={setAmount} />

            <label>Categoria</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories[type].map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>

            {type === "saving" && (
                <>
                    <label>Objetivo financeiro</label>

                    <select value={goalId} onChange={(event) => setGoalId(event.target.value)}>
                        <option value="">Sem objetivo específico</option>

                        {goals.map((goal) => (
                            <option key={goal.id} value={goal.id}>
                                {goal.title}
                            </option>
                        ))}
                    </select>
                </>
            )}

            <label>Descrição</label>

            <textarea
                placeholder="Ex: compra do mês, salário, dinheiro guardado..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            {error && <span className="transaction-error">{error}</span>}

            <button className="save-transaction" disabled={loading}>
                {loading ? "Salvando..." : "Salvar transação"}
            </button>
        </form>
    );
}

export default TransactionForm;
