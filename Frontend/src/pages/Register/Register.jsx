import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    DollarSign,
    Target,
    Users
} from "lucide-react";

import api from "../../services/api";
import "../../styles/auth.css";


function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [otherIncome, setOtherIncome] = useState("");

    const [monthlyGoal, setMonthlyGoal] = useState("");
    const [goalCategory, setGoalCategory] = useState("Reserva de emergência");

    const [competitionMode, setCompetitionMode] = useState("solo");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function nextStep() {
        setError("");

        if (step === 1) {
            if (!name || !email || !password || !confirmPassword) {
                setError("Preencha todos os campos.");
                return;
            }

            if (password !== confirmPassword) {
                setError("As senhas não coincidem.");
                return;
            }
        }

        if (step === 2) {
            if (!monthlyIncome) {
                setError("Informe sua renda mensal.");
                return;
            }
        }

        if (step === 3) {
            if (!monthlyGoal) {
                setError("Informe sua meta mensal.");
                return;
            }
        }

        setStep(step + 1);
    }

    function previousStep() {
        setError("");
        setStep(step - 1);
    }

    async function handleRegister(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                monthlyIncome: Number(monthlyIncome),
                otherIncome: Number(otherIncome || 0),
                monthlyGoal: Number(monthlyGoal),
                goalCategory,
                competitionMode
            });

            const { token, user } = response.data;

            localStorage.setItem("cashbattle_token", token);
            localStorage.setItem("cashbattle_user", JSON.stringify(user));

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Não foi possível criar a conta.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="register-top">
                <Link to="/login" className="back-link">
                    ←
                </Link>

                <h2>Criar conta</h2>
                <p>Vamos começar sua jornada financeira.</p>

                <div className="steps">
                    <div className={step >= 1 ? "step active" : "step"}>1</div>
                    <span></span>
                    <div className={step >= 2 ? "step active" : "step"}>2</div>
                    <span></span>
                    <div className={step >= 3 ? "step active" : "step"}>3</div>
                    <span></span>
                    <div className={step >= 4 ? "step active" : "step"}>4</div>
                </div>

                <div className="step-labels">
                    <small>Conta</small>
                    <small>Renda</small>
                    <small>Objetivo</small>
                    <small>Competição</small>
                </div>
            </section>

            <section className="login-card register-card">
                <form onSubmit={handleRegister}>
                    {step === 1 && (
                        <>
                            <div className="input-box">
                                <User size={20} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="input-box">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-box">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="eye-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="input-box">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirmar senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 className="step-title">Sua renda mensal</h3>

                            <div className="input-box">
                                <DollarSign size={20} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="Salário mensal"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                />
                            </div>

                            <div className="input-box">
                                <DollarSign size={20} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="Outras rendas (opcional)"
                                    value={otherIncome}
                                    onChange={(e) => setOtherIncome(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h3 className="step-title">Objetivo financeiro</h3>

                            <div className="input-box">
                                <Target size={20} className="input-icon" />
                                <input
                                    type="number"
                                    placeholder="Quanto deseja guardar por mês?"
                                    value={monthlyGoal}
                                    onChange={(e) => setMonthlyGoal(e.target.value)}
                                />
                            </div>

                            <select
                                className="select-box"
                                value={goalCategory}
                                onChange={(e) => setGoalCategory(e.target.value)}
                            >
                                <option>Reserva de emergência</option>
                                <option>Investir</option>
                                <option>Viajar</option>
                                <option>Comprar algo importante</option>
                                <option>Pagar dívidas</option>
                                <option>Outro</option>
                            </select>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h3 className="step-title">Como você quer competir?</h3>

                            <div className="competition-options">
                                <button
                                    type="button"
                                    className={competitionMode === "solo" ? "option-card selected" : "option-card"}
                                    onClick={() => setCompetitionMode("solo")}
                                >
                                    <Users size={22} />
                                    <strong>Apenas comigo</strong>
                                    <small>Compare sua evolução mês a mês.</small>
                                </button>

                                <button
                                    type="button"
                                    className={competitionMode === "friends" ? "option-card selected" : "option-card"}
                                    onClick={() => setCompetitionMode("friends")}
                                >
                                    <Users size={22} />
                                    <strong>Com amigos</strong>
                                    <small>Entre em rankings privados.</small>
                                </button>

                                <button
                                    type="button"
                                    className={competitionMode === "groups" ? "option-card selected" : "option-card"}
                                    onClick={() => setCompetitionMode("groups")}
                                >
                                    <Users size={22} />
                                    <strong>Grupos privados</strong>
                                    <small>Participe de desafios coletivos.</small>
                                </button>

                                <button
                                    type="button"
                                    className={competitionMode === "public" ? "option-card selected" : "option-card"}
                                    onClick={() => setCompetitionMode("public")}
                                >
                                    <Users size={22} />
                                    <strong>Ranking público</strong>
                                    <small>Compita com a comunidade.</small>
                                </button>
                            </div>
                        </>
                    )}

                    {error && <span className="error">{error}</span>}

                    <div className="register-actions">
                        {step > 1 && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={previousStep}
                            >
                                Voltar
                            </button>
                        )}

                        {step < 4 && (
                            <button
                                type="button"
                                className="login-button"
                                onClick={nextStep}
                            >
                                Continuar
                            </button>
                        )}

                        {step === 4 && (
                            <button
                                className="login-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Criando..." : "Finalizar"}
                            </button>
                        )}
                    </div>
                </form>

                {step === 1 && (
                    <p className="create-account">
                        Já possui uma conta?
                        <Link to="/login">Entrar</Link>
                    </p>
                )}
            </section>
        </main>
    );
}

export default Register;