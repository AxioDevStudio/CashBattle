import { useState } from "react";
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

            const { token, user } = response.data;

            localStorage.setItem("cashbattle_token", token);
            localStorage.setItem("cashbattle_user", JSON.stringify(user));

            alert(`Bem-vinda, ${user.name}!`);

            console.log("Token salvo:", token);
            console.log("Usuário:", user);

        } catch (err) {
            setError(err.response?.data?.error || "Erro ao fazer login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-logo">💰</div>

                <h1>CashBattle</h1>
                <p>Entre e continue sua batalha financeira.</p>

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Senha</label>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <span className="login-error">{error}</span>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <small>
                    Ainda não tem conta? <strong>Criar conta</strong>
                </small>
            </section>
        </main>
    );
}

export default Login;