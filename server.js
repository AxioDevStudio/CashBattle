import path from "path";
import express from "express";
import backendApp from "./Backend/src/app.js";

const PORT = 3000;
const isDev = process.env.NODE_ENV !== "production";

async function startServer() {
    if (isDev) {
        try {
            const { createServer: createViteServer } = await import("vite");
            const vite = await createViteServer({
                root: path.resolve(process.cwd(), "Frontend"),
                server: {
                    middlewareMode: true,
                },
                appType: "spa",
            });
            backendApp.use(vite.middlewares);
            console.log("[CashBattle] Vite middleware montado com sucesso.");
        } catch (err) {
            console.warn("[CashBattle] Fallback para arquivos estáticos:", err.message);
            serveStatic(backendApp);
        }
    } else {
        serveStatic(backendApp);
    }

    backendApp.listen(PORT, "0.0.0.0", () => {
        console.log(`CashBattle rodando na porta ${PORT} (0.0.0.0)`);
    });
}

function serveStatic(app) {
    const distPath = path.resolve(process.cwd(), "Frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

startServer();
