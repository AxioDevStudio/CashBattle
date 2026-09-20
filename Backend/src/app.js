import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

const uploadsPath = path.resolve(process.cwd(), "Backend/uploads");
app.use("/uploads", express.static(uploadsPath));
app.use("/api/uploads", express.static(uploadsPath));

app.use("/api", routes);
app.use(routes);

app.use((err, req, res, next) => {
    console.error("[CashBattle Backend Error]", err);
    res.status(err.status || 500).json({ error: err.message || "Erro interno do servidor." });
});

export default app;