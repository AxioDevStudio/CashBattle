import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PieChart, TrendingUp } from "lucide-react";
import api from "../../services/api";
import "../../styles/pages/statistics.css";

function Statistics() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        async function loadStats() {
            const token = localStorage.getItem("cashbattle_token");

            const response = await api.get("/transactions/summary", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSummary(response.data);
        }

        loadStats();
    }, []);

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    if (!summary) {
        return <main className="statistics-page">Carregando...</main>;
    }

    return (
        <main className="statistics-page">
            <header className="statistics-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1>Estatísticas</h1>
                    <p>Resumo do seu mês</p>
                </div>
            </header>

            <section className="statistics-card">
                <div>
                    <PieChart size={42} />
                    <h2>Distribuição financeira</h2>
                </div>

                <article>
                    <span>Renda</span>
                    <strong>{money(summary.income)}</strong>
                </article>

                <article>
                    <span>Gastos</span>
                    <strong className="danger">{money(summary.expense)}</strong>
                </article>

                <article>
                    <span>Guardado</span>
                    <strong>{money(summary.saving)}</strong>
                </article>
            </section>

            <section className="evolution-card">
                <TrendingUp size={28} />
                <div>
                    <h3>Evolução mensal</h3>
                    <p>Gráficos detalhados serão adicionados em breve.</p>
                </div>
            </section>
        </main>
    );
}

export default Statistics;