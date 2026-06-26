import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Trophy } from "lucide-react";

import api from "../services/api";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem("cashbattle_token", token);
            localStorage.setItem("cashbattle_user", JSON.stringify(user));

            setSuccess("Conta criada com sucesso!");
        } catch (err) {
            setError(err.response?.data?.error || "Não foi possível criar a conta.");
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
                    Comece sua jornada. <strong>Entre na batalha.</strong>
                </p>
            </section>

            <section className="login-card">
                <h2>Criar conta</h2>
                <p className="subtitle">Cadastre-se para competir economizando.</p>

                <form onSubmit={handleRegister}>
                    <div className="input-box">
                        <User size={20} className="input-icon" />

                        <input
                            type="text"
                            placeholder="Nome"
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

                    {error && <span className="error">{error}</span>}
                    {success && <span className="success">{success}</span>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar conta"}
                    </button>
                </form>

                <div className="divider">
                    <span></span>
                </div>

                <p className="create-account">
                    Já possui uma conta?
                    <Link to="/login">Entrar</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;