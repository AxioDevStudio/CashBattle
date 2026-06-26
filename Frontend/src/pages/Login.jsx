import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Trophy } from "lucide-react";

import api from "../services/api";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            const { token, user } = response.data;

            localStorage.setItem("cashbattle_token", token);
            localStorage.setItem("cashbattle_user", JSON.stringify(user));

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Não foi possível entrar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-header">

                <h1 className="logo-title">
                    CASH <span>BATTLE</span>
                </h1>

                <p>
                    Suas finanças. <strong>Sua batalha.</strong>
                </p>
            </section>

            <section className="login-card">
                <h2>Bem-vindo de volta</h2>
                <p className="subtitle">Faça login para continuar sua jornada.</p>

                <form onSubmit={handleLogin}>
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

                    <Link to="/forgot-password" className="forgot">
                        Esqueceu sua senha?
                    </Link>

                    {error && <span className="error">{error}</span>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="divider">
                    <span></span>
                </div>

                <p className="create-account">
                    Ainda não possui uma conta?
                    <Link to="/register">Criar conta</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;