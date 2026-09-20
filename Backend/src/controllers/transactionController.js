import {
    createTransactionService,
    listTransactionsService,
    findTransactionByIdService,
    updateTransactionService,
    deleteTransactionService,
    getTransactionSummaryService
} from "../services/transactionService.js";

export async function create(req, res) {
    try {
        const transaction = await createTransactionService(req.userId, req.body);
        const summaryData = await getTransactionSummaryService(req.userId);

        return res.status(201).json({
            message: "Transação criada com sucesso.",
            transaction,
            summary: summaryData
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

export async function update(req, res) {
    try {
        const transaction = await updateTransactionService(
            req.userId,
            req.params.id,
            req.body
        );
        const summaryData = await getTransactionSummaryService(req.userId);

        return res.json({
            message: "Transação atualizada com sucesso.",
            transaction,
            summary: summaryData
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        const transaction = await deleteTransactionService(
            req.userId,
            req.params.id
        );
        const summaryData = await getTransactionSummaryService(req.userId);

        return res.json({
            message: "Transação removida com sucesso.",
            transaction,
            summary: summaryData
        });
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

export async function findById(req, res) {
    try {
        const transaction = await findTransactionByIdService(
            req.userId,
            req.params.id
        );

        return res.json({ transaction });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}