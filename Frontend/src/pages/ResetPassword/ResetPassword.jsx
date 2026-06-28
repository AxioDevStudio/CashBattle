import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Trophy } from "lucide-react";

import api from "../../services/api";
import "../../styles/pages/login.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não conferem.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/reset-password", {
                token,
                password
            });

            setSuccess("Senha redefinida com sucesso.");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Não foi possível redefinir a senha."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-header">
                <div className="brand-icon">
                    <Trophy size={36} strokeWidth={2.4} />
                </div>

                <h1 className="logo-title">
                    CASH <span>BATTLE</span>
                </h1>

                <p>
                    Crie uma nova senha para voltar a acessar sua conta.
                </p>
            </section>

            <section className="login-card">
                <h2>Nova senha</h2>

                <p className="subtitle">
                    Digite e confirme sua nova senha.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <Lock size={20} className="input-icon" />

                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-box">
                        <Lock size={20} className="input-icon" />

                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && <span className="error">{error}</span>}
                    {success && <span className="success">{success}</span>}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Redefinir senha"}
                    </button>
                </form>

                <div className="divider">
                    <span></span>
                </div>

                <p className="create-account">
                    Lembrou sua senha?
                    <Link to="/login">Entrar</Link>
                </p>
            </section>
        </main>
    );
}

export default ResetPassword;