import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Trophy } from "lucide-react";
import api from "../../services/api";

import "../../styles/pages/login.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            await api.post("/auth/forgot-password", {
                email
            });

            setSuccess(
                "Se o email estiver cadastrado, enviaremos um link para redefinir sua senha."
            );

        } catch {

            setSuccess(
                "Se o email estiver cadastrado, enviaremos um link para redefinir sua senha."
            );

        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <h3></h3>
            <section className="login-header">

                <h1 className="logo-title">
                    CASH <span>BATTLE</span>
                </h1>

                <p>
                    Recupere o acesso. <strong>Continue evoluindo.</strong>
                </p>
            </section>

                <h2>Recuperar senha</h2>

                <p className="subtitle">
                    Informe seu email para receber as instruções.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <Mail size={20} className="input-icon" />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {success && <span className="success">{success}</span>}

                    <button className="login-button" type="submit">
                        Enviar instruções
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

export default ForgotPassword;