import express from "express";
import pool from "./config/database.js";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {

    const result = await pool.query("SELECT NOW()");

    res.json({
        api: "CashBattle",
        database: result.rows[0].now
    });

});

export default app;