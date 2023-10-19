import database from "./databaseplièjjk.op)$$456.js";

const getUsers = async () => {
  const [rows] = await database.query("SELECT * FROM users");
  return rows;
};

const getUser = async (user) => {
  const [rows] = await database.query("SELECT * FROM users WHERE email = ? AND password = ?", [user.email, user.password]);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await database.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0]; // Assuming id is unique, so we return the first matching user
};

const getUserByEmail = async (email) => {
  const [rows] = await database.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // Assuming email is unique, so we return the first matching user
};

const editUser = async (user) => {
  const newData = [user.name, user.email, user.password, user.phone, user.age, user.account_limit, user.notification_preference];
  const query = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, age = ?, account_limit = ?, notification_preference = ? WHERE email = ?";
  const [rows] = await database.query(query, [...newData, user.email]);
  return rows;
};

const createUser = async (user) => {
  try {
    const [rows] = await database.query("INSERT INTO users (name, email, password, phone, age, account_limit, notification_preference, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user.name, user.email, user.password, user.phone, user.age, user.account_limit, user.notification_preference, user.balance]);
    return rows;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export default {
  getUsers,
  getUser,
  getUserByEmail,
  editUser,
  createUser,
  getUserById,
};
