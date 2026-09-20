import Topbar from "../navigation/Topbar";

function DashboardHeader({ user, greeting, onMenu, onProfile }) {
    return (
        <Topbar
            title={user?.name || "Usuário"}
            subtitle={greeting}
            avatar={user?.name?.charAt(0) || "U"}
            onMenu={onMenu}
            onProfile={onProfile}
        />
    );
}

export default DashboardHeader;
