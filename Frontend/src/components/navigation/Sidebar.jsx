import {
    X,
    User,
    Plus,
    Target,
    Settings,
    Users,
    UserPlus,
    Pencil,
    LogOut
} from "lucide-react";

function Sidebar({ open, user, onClose, onNavigate, onLogout }) {
    if (!open) return null;

    const items = [
        { label: "Perfil", path: "/profile", icon: User },
        { label: "Adicionar transação", path: "/transaction", icon: Plus },
        { label: "Editar ou remover", path: "/transactions", icon: Pencil },
        { label: "Objetivos", path: "/goals", icon: Target },
        { label: "Criar grupo", path: "/groups/create", icon: Users },
        { label: "Entrar em grupo", path: "/groups/join", icon: UserPlus },
        { label: "Configurações", path: "/settings", icon: Settings }
    ];

    return (
        <div className="sidebar-overlay" onClick={onClose}>
            <aside className="sidebar" onClick={(event) => event.stopPropagation()}>
                <div className="sidebar-header">
                    <div>
                        <span>Menu</span>
                        <h2>CashBattle</h2>
                    </div>

                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                        <strong>{user?.name || "Usuário"}</strong>
                        <p>{user?.email || "Sem email"}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button key={item.path} onClick={() => onNavigate(item.path)}>
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <button className="sidebar-logout" onClick={onLogout}>
                    <LogOut size={20} />
                    Sair da conta
                </button>
            </aside>
        </div>
    );
}

export default Sidebar;
