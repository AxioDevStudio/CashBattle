import { useState, useId } from "react";
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Sparkles,
    CheckCircle2,
    Plus,
    Tag,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    RotateCcw,
} from "lucide-react";
import api from "../../services/api";

const CATEGORIES_MAP = {
    income: [
        { label: "Salário", icon: "💼" },
        { label: "Freelancer", icon: "💻" },
        { label: "PIX Recebido", icon: "⚡" },
        { label: "Rendimentos", icon: "📈" },
        { label: "Venda", icon: "🏷️" },
        { label: "Outro", icon: "✨" },
    ],
    expense: [
        { label: "Alimentação", icon: "🍔" },
        { label: "Mercado", icon: "🛒" },
        { label: "Transporte", icon: "🚗" },
        { label: "Moradia", icon: "🏠" },
        { label: "Lazer", icon: "🎮" },
        { label: "Saúde", icon: "💊" },
        { label: "Compras", icon: "🛍️" },
        { label: "Outro", icon: "📦" },
    ],
    saving: [
        { label: "Reserva de Emergência", icon: "🛡️" },
        { label: "Investimentos", icon: "📊" },
        { label: "Viagem", icon: "✈️" },
        { label: "Outro", icon: "🎯" },
    ],
};

const QUICK_AMOUNTS = [20, 50, 100, 200, 500];

function formatCurrency(val) {
    return Number(val || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function TransactionLogger({
    currentNetWorth = 0,
    currentBalance = 0,
    currentSaved = 0,
    onTransactionLogged,
    initialType = "expense",
    compact = false,
    title = "Registrar Transação",
}) {
    const componentId = useId();
    const [type, setType] = useState(initialType);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(CATEGORIES_MAP[initialType][0].label);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [recentLogs, setRecentLogs] = useState([]);

    const numAmount = parseFloat(amount.replace(",", ".")) || 0;

    // Calculate dynamic projected Net Worth and Balances
    let projectedNetWorth = Number(currentNetWorth || 0);
    let projectedBalance = Number(currentBalance || 0);
    let projectedSaved = Number(currentSaved || 0);
    let netWorthImpact = 0;

    if (type === "income") {
        netWorthImpact = numAmount;
        projectedNetWorth += numAmount;
        projectedBalance += numAmount;
    } else if (type === "expense") {
        netWorthImpact = -numAmount;
        projectedNetWorth -= numAmount;
        projectedBalance -= numAmount;
    } else if (type === "saving") {
        // Saving reallocates balance to savings, keeping net worth unchanged
        netWorthImpact = 0;
        projectedBalance -= numAmount;
        projectedSaved += numAmount;
    }

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(CATEGORIES_MAP[newType][0].label);
        setError("");
        setSuccessMessage("");
    };

    const handleQuickAmount = (val) => {
        setAmount(String(val));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!numAmount || numAmount <= 0) {
            setError("Informe um valor válido maior que zero.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("cashbattle_token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const payload = {
                type,
                amount: numAmount,
                category,
                description: description.trim() || undefined,
                transactionDate: new Date().toISOString(),
            };

            const response = await api.post("/transactions", payload, { headers });

            const newSummary = response.data.summary;
            const createdTx = response.data.transaction;

            const logEntry = {
                id: createdTx?.id || Date.now(),
                type,
                amount: numAmount,
                category,
                description: description.trim() || category,
                date: new Date(),
                netWorthImpact,
            };

            setRecentLogs((prev) => [logEntry, ...prev.slice(0, 2)]);

            setSuccessMessage(
                type === "income"
                    ? `Receita de ${formatCurrency(numAmount)} adicionada! Patrimônio aumentado.`
                    : type === "expense"
                    ? `Gasto de ${formatCurrency(numAmount)} registrado! Patrimônio atualizado.`
                    : `Valor de ${formatCurrency(numAmount)} guardado na poupança!`
            );

            // Notify parent to dynamically update net worth and summary in real-time
            if (typeof onTransactionLogged === "function") {
                onTransactionLogged(newSummary, createdTx);
            }

            // Reset inputs
            setAmount("");
            setDescription("");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error ||
                    "Não foi possível registrar a transação. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className={`transaction-logger-card ${compact ? "compact" : ""}`}
            id={`tx-logger-${componentId}`}
        >
            <div className="tx-logger-header">
                <div className="tx-logger-title-group">
                    <span className="tx-logger-badge">
                        <Sparkles size={14} className="sparkle-icon" />
                        Registro Rápido
                    </span>
                    <h3 className="tx-logger-title">{title}</h3>
                </div>

                {/* Type switcher */}
                <div className="tx-type-pill-selector">
                    <button
                        type="button"
                        id="tx-type-btn-income"
                        className={`type-pill ${type === "income" ? "active income" : ""}`}
                        onClick={() => handleTypeChange("income")}
                    >
                        <TrendingUp size={15} />
                        Receita
                    </button>
                    <button
                        type="button"
                        id="tx-type-btn-expense"
                        className={`type-pill ${type === "expense" ? "active expense" : ""}`}
                        onClick={() => handleTypeChange("expense")}
                    >
                        <TrendingDown size={15} />
                        Despesa
                    </button>
                    <button
                        type="button"
                        id="tx-type-btn-saving"
                        className={`type-pill ${type === "saving" ? "active saving" : ""}`}
                        onClick={() => handleTypeChange("saving")}
                    >
                        <PiggyBank size={15} />
                        Guardar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="tx-logger-form">
                {/* Amount input */}
                <div className="tx-amount-group">
                    <label htmlFor={`tx-amount-input-${componentId}`}>Valor</label>
                    <div className="tx-amount-field-wrapper">
                        <span className="tx-currency-symbol">R$</span>
                        <input
                            id={`tx-amount-input-${componentId}`}
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError("");
                                setSuccessMessage("");
                            }}
                            className="tx-amount-input"
                            autoComplete="off"
                        />
                    </div>

                    {/* Quick amount chips */}
                    <div className="tx-quick-chips">
                        {QUICK_AMOUNTS.map((val) => (
                            <button
                                key={val}
                                type="button"
                                className="quick-chip-btn"
                                onClick={() => handleQuickAmount(val)}
                            >
                                +R${val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category selector */}
                <div className="tx-field-group">
                    <label htmlFor={`tx-category-select-${componentId}`}>
                        <Tag size={13} />
                        Categoria
                    </label>
                    <div className="tx-category-chips">
                        {(CATEGORIES_MAP[type] || []).map((cat) => (
                            <button
                                key={cat.label}
                                type="button"
                                className={`category-chip ${
                                    category === cat.label ? "active" : ""
                                }`}
                                onClick={() => setCategory(cat.label)}
                            >
                                <span className="cat-icon">{cat.icon}</span>
                                <span className="cat-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description input */}
                <div className="tx-field-group">
                    <label htmlFor={`tx-desc-input-${componentId}`}>
                        <FileText size={13} />
                        Descrição (opcional)
                    </label>
                    <input
                        id={`tx-desc-input-${componentId}`}
                        type="text"
                        placeholder="Ex: Salário adiantado, almoço com amigos..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="tx-text-input"
                    />
                </div>

                {/* Live Dynamic Net Worth Impact Box */}
                <div
                    className={`dynamic-net-worth-preview ${
                        numAmount > 0
                            ? type === "income"
                                ? "positive"
                                : type === "expense"
                                ? "negative"
                                : "neutral"
                            : ""
                    }`}
                >
                    <div className="preview-top-row">
                        <span className="preview-label">Impacto no Patrimônio Líquido</span>
                        <span className="preview-impact">
                            {numAmount <= 0 ? (
                                "R$ 0,00"
                            ) : type === "income" ? (
                                <span className="impact-pos">
                                    <ArrowUpRight size={14} />+{formatCurrency(numAmount)}
                                </span>
                            ) : type === "expense" ? (
                                <span className="impact-neg">
                                    <ArrowDownRight size={14} />-{formatCurrency(numAmount)}
                                </span>
                            ) : (
                                <span className="impact-neutral">
                                    ± {formatCurrency(0)} (Alocação interna)
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="preview-bottom-row">
                        <span className="projected-label">Patrimônio projetado:</span>
                        <strong className="projected-value">
                            {formatCurrency(projectedNetWorth)}
                        </strong>
                    </div>

                    {numAmount > 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "11px",
                                color: "#64748b",
                                paddingTop: "4px",
                            }}
                        >
                            <span>
                                Saldo disponível projetado:{" "}
                                <strong style={{ color: "#334155" }}>
                                    {formatCurrency(projectedBalance)}
                                </strong>
                            </span>
                            {type === "saving" && (
                                <span>
                                    Guardado:{" "}
                                    <strong style={{ color: "#2563eb" }}>
                                        {formatCurrency(projectedSaved)}
                                    </strong>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Feedback messages */}
                {error && <div className="tx-logger-error">{error}</div>}
                {successMessage && (
                    <div className="tx-logger-success">
                        <CheckCircle2 size={16} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    id={`btn-submit-tx-${componentId}`}
                    className={`tx-logger-submit-btn ${type}`}
                    disabled={loading || !numAmount || numAmount <= 0}
                >
                    {loading ? (
                        <span>Registrando...</span>
                    ) : (
                        <>
                            <Plus size={18} />
                            <span>
                                {type === "income"
                                    ? "Lançar Receita"
                                    : type === "expense"
                                    ? "Lançar Despesa"
                                    : "Guardar Dinheiro"}
                            </span>
                        </>
                    )}
                </button>
            </form>

            {/* Quick list of transactions logged in this session */}
            {recentLogs.length > 0 && (
                <div className="tx-recent-logs">
                    <span className="recent-logs-header">
                        <RotateCcw size={12} />
                        Lançamentos recentes nesta sessão
                    </span>
                    <div className="recent-logs-list">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="recent-log-item">
                                <div className="recent-log-info">
                                    <span className="recent-log-title">
                                        {log.description}
                                    </span>
                                    <span className="recent-log-category">
                                        {log.category}
                                    </span>
                                </div>
                                <span
                                    className={`recent-log-amount ${
                                        log.type === "income"
                                            ? "income"
                                            : log.type === "expense"
                                            ? "expense"
                                            : "saving"
                                    }`}
                                >
                                    {log.type === "income" ? "+" : log.type === "expense" ? "-" : ""}{" "}
                                    {formatCurrency(log.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default TransactionLogger;
