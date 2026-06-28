import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Pencil,
    Trash2,
    Plus,
    RefreshCw,
    Wallet
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/income.css";

function Income() {
    const navigate = useNavigate();

    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadIncomes() {
        try {
            setLoading(true);

            const token = localStorage.getItem("cashbattle_token");

            const response = await api.get("/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data.transactions
                .filter((item) => item.type === "income")
                .sort(
                    (a, b) =>
                        new Date(b.transaction_date) -
                        new Date(a.transaction_date)
                );

            setIncomes(data);
        } catch (error) {
            console.error("Erro ao carregar receitas:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadIncomes();
    }, []);

    async function removeIncome(id) {
        if (!window.confirm("Excluir esta receita?")) return;

        const token = localStorage.getItem("cashbattle_token");

        await api.delete(`/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        loadIncomes();
    }

    const filtered = useMemo(() => {
        return incomes.filter((item) => {
            const text = `${item.category} ${item.description}`.toLowerCase();
            return text.includes(search.toLowerCase());
        });
    }, [incomes, search]);

    const total = filtered.reduce((acc, item) => acc + Number(item.amount), 0);

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <main className="income-page">
            <header className="income-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1>Receitas</h1>
                    <p>{filtered.length} transações</p>
                </div>

                <button
                    className="add-button"
                    onClick={() => navigate("/transaction")}
                >
                    <Plus size={20} />
                </button>
            </header>

            <section className="income-summary">
                <Wallet size={30} />
                <span>Total recebido</span>
                <h2>{money(total)}</h2>
            </section>

            <div className="income-search">
                <Search size={18} />

                <input
                    placeholder="Pesquisar receita..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={loadIncomes}>
                    <RefreshCw size={18} />
                </button>
            </div>

            {loading && <p className="income-empty">Carregando receitas...</p>}

            {!loading && filtered.length === 0 && (
                <section className="income-empty">
                    <Wallet size={52} />
                    <h3>Nenhuma receita encontrada</h3>
                    <p>Quando você registrar uma receita, ela aparecerá aqui.</p>

                    <button onClick={() => navigate("/transaction")}>
                        Adicionar receita
                    </button>
                </section>
            )}

            <section className="income-list">
                {filtered.map((income) => (
                    <article key={income.id} className="income-card">
                        <div>
                            <h3>{income.category}</h3>
                            <p>{income.description || "Sem descrição"}</p>
                            <small>
                                {new Date(income.transaction_date).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </small>
                        </div>

                        <div className="income-actions">
                            <strong>{money(income.amount)}</strong>

                            <div>
                                <button
                                    onClick={() =>
                                        navigate(`/transaction/${income.id}`)
                                    }
                                >
                                    <Pencil size={16} />
                                </button>

                                <button onClick={() => removeIncome(income.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

export default Income;