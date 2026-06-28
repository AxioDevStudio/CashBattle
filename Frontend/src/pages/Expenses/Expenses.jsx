import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Pencil,
    Trash2,
    Plus,
    RefreshCw,
    ShoppingBag,
    Filter
} from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/expenses.css";

function Expenses() {
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");

    async function loadExpenses() {
        try {
            setLoading(true);

            const token = localStorage.getItem("cashbattle_token");

            const response = await api.get("/transactions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const onlyExpenses = response.data.transactions.filter(
                (item) => item.type === "expense"
            );

            onlyExpenses.sort(
                (a, b) =>
                    new Date(b.transaction_date) -
                    new Date(a.transaction_date)
            );

            setExpenses(onlyExpenses);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, []);

    async function removeExpense(id) {
        if (!window.confirm("Excluir este gasto?")) return;

        try {
            const token = localStorage.getItem("cashbattle_token");

            await api.delete(`/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            loadExpenses();
        } catch (error) {
            console.error(error);
        }
    }

    const categories = useMemo(() => {
        const values = [
            "Todas",
            ...new Set(expenses.map((e) => e.category)),
        ];

        return values;
    }, [expenses]);

    const filtered = useMemo(() => {
        return expenses.filter((item) => {
            const text =
                `${item.category} ${item.description}`.toLowerCase();

            const matchSearch = text.includes(search.toLowerCase());

            const matchCategory =
                category === "Todas" ||
                item.category === category;

            return matchSearch && matchCategory;
        });
    }, [expenses, search, category]);

    const total = filtered.reduce(
        (acc, item) => acc + Number(item.amount),
        0
    );

    function money(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <main className="expenses-page">
            <header className="expenses-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1>Gastos</h1>
                    <p>{filtered.length} transações</p>
                </div>

                <button
                    className="add-button"
                    onClick={() => navigate("/transaction")}
                >
                    <Plus size={20} />
                </button>
            </header>

            <section className="expenses-summary">
                <span>Total gasto</span>

                <h2>{money(total)}</h2>

                <small>
                    {filtered.length} despesas registradas
                </small>
            </section>

            <div className="search-box">
                <Search size={18} />

                <input
                    placeholder="Pesquisar gasto..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    className="refresh-button"
                    onClick={loadExpenses}
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="category-filter">
                <Filter size={18} />

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >
                    {categories.map((item) => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="loading-expenses">
                    Carregando gastos...
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <section className="empty-expenses">
                    <ShoppingBag size={60} />

                    <h3>Nenhum gasto encontrado</h3>

                    <p>
                        Quando você registrar um gasto,
                        ele aparecerá aqui.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/transaction")
                        }
                    >
                        Adicionar gasto
                    </button>
                </section>
            )}

            <section className="expense-list">
                {filtered.map((expense) => (
                    <article
                        key={expense.id}
                        className="expense-card"
                    >
                        <div className="expense-info">
                            <h3>{expense.category}</h3>

                            <p>
                                {expense.description ||
                                    "Sem descrição"}
                            </p>

                            <small>
                                {new Date(
                                    expense.transaction_date
                                ).toLocaleDateString(
                                    "pt-BR"
                                )}
                            </small>
                        </div>

                        <div className="expense-actions">
                            <strong>
                                {money(expense.amount)}
                            </strong>

                            <div>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/transaction/${expense.id}`
                                        )
                                    }
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() =>
                                        removeExpense(
                                            expense.id
                                        )
                                    }
                                >
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

export default Expenses;