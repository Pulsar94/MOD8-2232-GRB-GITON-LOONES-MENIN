import database from "./database.js";

const createTransaction = async (transaction) => {
  const [rows] = await database.query("INSERT INTO transactions (user_id, category, libelle, amount, date) VALUES (?, ?, ?, ?, ?)", [transaction.userId, transaction.category, transaction.libelle, transaction.amount, transaction.date]);
  return rows;
};

const getTransactionsByUserId = async (userId) => {
  const [rows] = await database.query("SELECT * FROM transactions WHERE user_id = ?", [userId]);
  return rows;
};

const getUsers = async () => {
  const [rows] = await database.query("SELECT * FROM users");
  return rows;
};

const getUserByMail = async (mail) => {
  const [rows] = await database.query("SELECT * FROM users WHERE email = ?", [mail]);
  return rows;
};

const editUser = async (user) => {
    const newData = [user.name, user.email, user.password, user.phone, user.age, user.limit, user.notifications];
    const query = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, age = ?, account_limit = ?, notification_preference = ? WHERE id = ?";
    const [rows] = await database.query(query, [...newData, user.id]);
    return rows;
  };
  

export default {
  createTransaction,
  getTransactionsByUserId,
  getUsers,
  getUserByMail,
  editUser,
};
