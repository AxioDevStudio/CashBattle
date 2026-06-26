import express from "express";
import cors from "cors";
import pool from "./config/database.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const result = await pool.query("SELECT NOW()");

    res.json({
        api: "CashBattle",
        database: result.rows[0].now
    });
});

app.use(routes);

export default app;