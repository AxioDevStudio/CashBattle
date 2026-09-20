import { Menu } from "lucide-react";

function Topbar({ title, subtitle, avatar, onMenu, onProfile }) {
    return (
        <header className="minimal-header">
            <button className="menu-button" onClick={onMenu}>
                <Menu size={22} />
            </button>

            <div>
                {subtitle && <span>{subtitle}</span>}
                <h1>{title}</h1>
            </div>

            <button className="avatar-shortcut" onClick={onProfile}>
                {avatar || "U"}
            </button>
        </header>
    );
}

export default Topbar;
