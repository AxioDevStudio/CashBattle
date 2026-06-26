function Dashboard() {
    const user = JSON.parse(localStorage.getItem("cashbattle_user"));

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#090b10",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}
        >
            <h1>CashBattle</h1>

            <h2>Bem-vindo, {user?.name}!</h2>

            <p>Dashboard em desenvolvimento...</p>
        </main>
    );
}

export default Dashboard;