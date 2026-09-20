import { useNavigate } from "react-router-dom";
import {
    PiggyBank,
    Target,
    Trophy,
    ArrowRight,
    TrendingUp
} from "lucide-react";

import "../../styles/pages/onboarding.css";

function Onboarding() {
    const navigate = useNavigate();

    return (
        <main className="onboarding-page">

            <section className="hero">

                <span className="hero-brand">
                    CashBattle
                </span>

                <h1>
                    Transforme suas finanças em uma jornada.
                </h1>

                <p>
                    Planeje seus objetivos, acompanhe sua evolução e
                    desbloqueie conquistas enquanto economiza.
                </p>

            </section>

            <section className="features">

                <article>
                    <div>
                        <Target size={22} />
                    </div>

                    <div>
                        <strong>Objetivos</strong>

                        <span>
                            Crie metas financeiras e acompanhe seu progresso.
                        </span>
                    </div>
                </article>

                <article>
                    <div>
                        <PiggyBank size={22} />
                    </div>

                    <div>
                        <strong>Economize</strong>

                        <span>
                            Controle receitas, despesas e reservas.
                        </span>
                    </div>
                </article>

                <article>
                    <div>
                        <Trophy size={22} />
                    </div>

                    <div>
                        <strong>Conquistas</strong>

                        <span>
                            Ganhe XP, suba de nível e acompanhe sua evolução.
                        </span>
                    </div>
                </article>

            </section>

            <section className="onboarding-actions">

                <button
                    className="primary-button"
                    onClick={() => navigate("/register")}
                >
                    Criar conta

                    <ArrowRight size={18} />
                </button>

                <button
                    className="secondary-button"
                    onClick={() => navigate("/login")}
                >
                    Já tenho uma conta
                </button>

            </section>

        </main>
    );
}

export default Onboarding;