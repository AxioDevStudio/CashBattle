import express from "express";
import app from "./app.js";
import pool from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.use("/uploads", express.static("uploads"));

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(`Servidor iniciado em http://localhost:${PORT}`);
        console.log("PostgreSQL conectado!");
    } catch (error) {
        console.error("Erro ao conectar no PostgreSQL:", error.message);
    }
});