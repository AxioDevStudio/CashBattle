import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Trophy } from "lucide-react";

import "../styles/login.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setSuccess(
            "Se esse email estiver cadastrado, enviaremos instruções para recuperação."
        );
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
                    Recupere o acesso. <strong>Continue evoluindo.</strong>
                </p>
            </section>

            <section className="login-card">
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