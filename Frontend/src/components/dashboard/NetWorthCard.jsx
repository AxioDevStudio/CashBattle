import { useState, useEffect, useRef } from "react";
import {
    Wallet,
    PiggyBank,
    TrendingUp,
    Eye,
    EyeOff,
    Target,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";

/**
 * NetWorthCard - Main dashboard component displaying user net worth
 * and a responsive progress bar for monthly savings goals.
 */
function NetWorthCard({
    netWorth,
    balance = 0,
    saved = 0,
    monthlyGoal = 0,
    goalCategory,
    formatMoney,
    onViewGoals,
    onAddSavings,
}) {
    const [showValues, setShowValues] = useState(true);
    const [pulse, setPulse] = useState(false);

    const safeFormat = (val) => {
        if (!showValues) return "••••••";
        if (typeof formatMoney === "function") {
            return formatMoney(val);
        }
        return Number(val || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const calculatedNetWorth =
        netWorth !== undefined && netWorth !== null
            ? Number(netWorth)
            : Number(balance || 0) + Number(saved || 0);

    const prevNetWorthRef = useRef(calculatedNetWorth);

    useEffect(() => {
        if (prevNetWorthRef.current !== calculatedNetWorth) {
            setPulse(true);
            prevNetWorthRef.current = calculatedNetWorth;
            const timer = setTimeout(() => setPulse(false), 900);
            return () => clearTimeout(timer);
        }
    }, [calculatedNetWorth]);

    const goal = Number(monthlyGoal || 0);
    const currentSaved = Number(saved || 0);
    const progressPercent =
        goal > 0 ? Math.min(Math.round((currentSaved / goal) * 100), 100) : 0;
    const rawPercent = goal > 0 ? (currentSaved / goal) * 100 : 0;
    const remaining = Math.max(0, goal - currentSaved);
    const isGoalCompleted = goal > 0 && currentSaved >= goal;

    return (
        <section className="net-worth-card" id="main-net-worth-dashboard">
            {/* Header: Net Worth & Privacy Toggle */}
            <div className="net-worth-header">
                <div className="net-worth-title-group">
                    <span className="net-worth-label">
                        <TrendingUp size={16} className="trend-icon" />
                        Patrimônio Líquido
                    </span>
                    <h2
                        className={`net-worth-value ${pulse ? "pulse-highlight" : ""}`}
                        id="net-worth-display"
                    >
                        {safeFormat(calculatedNetWorth)}
                    </h2>
                </div>

                <button
                    type="button"
                    className="visibility-toggle-btn"
                    onClick={() => setShowValues(!showValues)}
                    title={showValues ? "Ocultar valores" : "Mostrar valores"}
                    aria-label={showValues ? "Ocultar valores" : "Mostrar valores"}
                    id="toggle-net-worth-visibility"
                >
                    {showValues ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            {/* Quick breakdown metrics: Available Cash & Savings */}
            <div className="net-worth-breakdown">
                <div className="breakdown-item">
                    <div className="breakdown-label">
                        <Wallet size={14} className="icon-subtle" />
                        <span>Saldo em conta</span>
                    </div>
                    <strong className="breakdown-value">
                        {safeFormat(balance)}
                    </strong>
                </div>

                <div className="breakdown-divider" />

                <div className="breakdown-item">
                    <div className="breakdown-label">
                        <PiggyBank size={14} className="icon-subtle" />
                        <span>Total guardado</span>
                    </div>
                    <strong className="breakdown-value highlight">
                        {safeFormat(saved)}
                    </strong>
                </div>
            </div>

            {/* Monthly Savings Goal & Progress Bar Section */}
            <div className="savings-goal-container">
                <div className="savings-goal-top">
                    <div className="goal-title-wrapper">
                        <div className="goal-icon-badge">
                            <Target size={16} />
                        </div>
                        <div>
                            <span className="goal-super-label">Meta do Mês</span>
                            <h4 className="goal-name">
                                {goalCategory || "Economia Geral"}
                            </h4>
                        </div>
                    </div>

                    <div className="goal-percent-badge-wrapper">
                        <span
                            className={`goal-percent-badge ${
                                isGoalCompleted ? "completed" : ""
                            }`}
                        >
                            {rawPercent.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Visual Progress Bar */}
                <div
                    className="savings-progress-track"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progresso da meta mensal de economia"
                >
                    <div
                        className={`savings-progress-fill ${
                            isGoalCompleted ? "fill-completed" : ""
                        }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Progress details & remaining amounts */}
                <div className="savings-progress-meta">
                    <span className="savings-ratio">
                        {safeFormat(currentSaved)} de {safeFormat(goal)}
                    </span>

                    <span className="savings-status">
                        {goal === 0 ? (
                            "Nenhuma meta definida"
                        ) : isGoalCompleted ? (
                            <span className="status-success">
                                <CheckCircle2 size={13} />
                                Meta atingida!
                            </span>
                        ) : (
                            <span>
                                Faltam <strong>{safeFormat(remaining)}</strong>
                            </span>
                        )}
                    </span>
                </div>

                {/* Footer action link to goals or savings */}
                {(onViewGoals || onAddSavings) && (
                    <div className="savings-card-actions">
                        {onAddSavings && (
                            <button
                                type="button"
                                className="action-pill-btn primary"
                                onClick={onAddSavings}
                                id="btn-add-savings-shortcut"
                            >
                                <PiggyBank size={14} />
                                Guardar dinheiro
                            </button>
                        )}
                        {onViewGoals && (
                            <button
                                type="button"
                                className="action-pill-btn secondary"
                                onClick={onViewGoals}
                                id="btn-view-goals-shortcut"
                            >
                                Detalhes das metas
                                <ArrowUpRight size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default NetWorthCard;
