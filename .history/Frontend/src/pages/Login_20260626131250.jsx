import { useState } from "react";
import { Mail, Lock, Eye, Swords } from "lucide-react";
import api from "../services/api";
import "../styles/login.css";

function Login() {
    const [email, setEmail] = useState("maria@email.com");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("cashbattle_token", response.data.token);
            localStorage.setItem("cashbattle_user", JSON.stringify(response.data.user));

            alert(`Bem-vinda, ${response.data.user.name}!`);
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao fazer login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-header">
                <div className="brand-icon">
                    <Swords size={34} strokeWidth={2.4} />
                </div>

                <h1 className="logo-title">
                    CASH <span>BATTLE</span>
                </h1>

                <p>
                    Suas finanças. <strong>Sua batalha.</strong>
                </p>
            </section>

            <section className="login-card">
                <h2>Bem-vindo de volta!</h2>
                <p className="subtitle">Entre na sua conta para continuar.</p>

                <form onSubmit={handleLogin}>
                    <div className="input-box">
                        <Mail size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-box">
                        <Lock size={20} />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Eye size={20} />
                    </div>

                    <button type="button" className="forgot">
                        Esqueceu sua senha?
                    </button>

                    {error && <span className="error">{error}</span>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="divider">
                    <span></span>
                </div>

                <p className="create-account">
                    Ainda não tem conta? <strong>Criar conta</strong>
                </p>
            </section>
        </main>
    );
}

export default Login;