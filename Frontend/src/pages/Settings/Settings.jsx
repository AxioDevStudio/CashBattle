import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Bell,
    Shield,
    Moon,
    HelpCircle,
    LogOut
} from "lucide-react";

import "../../styles/pages/settings.css";

function Settings() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("cashbattle_token");
        localStorage.removeItem("cashbattle_user");
        navigate("/login");
    }

    return (
        <main className="settings-page">
            <header className="settings-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={22} />
                </button>

                <h1>Configurações</h1>
            </header>

            <section className="settings-list">
                <button>
                    <User size={20} />
                    Dados da conta
                </button>

                <button>
                    <Bell size={20} />
                    Notificações
                </button>

                <button>
                    <Shield size={20} />
                    Privacidade
                </button>

                <button>
                    <Moon size={20} />
                    Tema
                    <span>Claro</span>
                </button>

                <button>
                    <HelpCircle size={20} />
                    Central de ajuda
                </button>
            </section>

            <button className="logout-settings" onClick={logout}>
                <LogOut size={20} />
                Sair da conta
            </button>
        </main>
    );
}

export default Settings;