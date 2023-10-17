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

const getUsers = async () => {
  const [rows] = await database.query("SELECT * FROM users");
  return rows;
};

const getUser = async (user) => {
  const [rows] = await database.query("SELECT * FROM users WHERE email = ? AND password = ?", [user.email, user.password]);
  return rows;
}

const getUserByEmail = async (email) => {
  const [rows] = await database.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // Assuming email is unique, so we return the first matching user
};

const editUser = async (user) => {
  const newData = [user.name, user.email, user.password, user.phone, user.age, user.account_limit, user.notification_preference];
  const query = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, age = ?, account_limit = ?, notification_preference = ? WHERE id = ?";
  const [rows] = await database.query(query, [...newData, user.id]);
  return rows;
};

const createUser = async (user) => {
  try {
    const [rows] = await database.query("INSERT INTO users (name, email, password, phone, age, account_limit, notification_preference) VALUES (?, ?, ?, ?, ?, ?, ?)", [user.name, user.email, user.password, user.phone, user.age, user.account_limit, user.notification_preference]);
    return rows;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


export default {
  createTransaction,
  getTransactions,
  getTransactionsByUserId,
  getUsers,
  getUser,
  getUserByEmail,
  editUser,
  createUser,
};
