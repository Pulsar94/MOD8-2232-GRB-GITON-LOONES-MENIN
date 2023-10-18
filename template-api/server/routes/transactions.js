import express from "express";
import repository from "../persistence/transactions-repository.js";

const router = express.Router();

// GET request handler for /api/transactions/:UserId URL
router.get("/transactions/:userId", async (req, res, next) => {
  try {
    const transactions = await repository.getTransactionsByUserId(req.params.userId);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// GET request handler for /api/transactions URL
router.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await repository.getTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// POST request handler for /api/transactions URL
router.post("/transactions", async (req, res, next) => {
  try {
    const transaction = await repository.createTransaction(req.body);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

export default router;
