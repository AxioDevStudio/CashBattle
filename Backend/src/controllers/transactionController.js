import {
    createTransactionService,
    listTransactionsService,
    getTransactionSummaryService
} from "../services/transactionService.js";

export async function create(req, res) {
    try {
        const transaction = await createTransactionService(req.userId, req.body);

        return res.status(201).json({
            message: "Transação criada com sucesso.",
            transaction
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function list(req, res) {
    try {
        const transactions = await listTransactionsService(req.userId);

        return res.json({ transactions });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function summary(req, res) {
    try {
        const summaryData = await getTransactionSummaryService(req.userId);

        return res.json(summaryData);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}