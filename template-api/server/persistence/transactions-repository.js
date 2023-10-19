import database from "./databaseplièjjk.op)$$456.js";

const createTransaction = async (transaction) => {
  const [rows] = await database.query("INSERT INTO transactions (user_id, category, libelle, amount, date) VALUES (?, ?, ?, ?, ?)", [transaction.userId, transaction.category, transaction.libelle, transaction.amount, transaction.date]);
  return rows;
};

const getTransactions = async () => {
  const [rows] = await database.query("SELECT * FROM transactions");
  return rows;
};

const getTransactionsByUserId = async (userId) => {
  const [rows] = await database.query("SELECT * FROM transactions WHERE user_id = ?", [userId]);
  return rows;
};


export default {
  createTransaction,
  getTransactions,
  getTransactionsByUserId,
};