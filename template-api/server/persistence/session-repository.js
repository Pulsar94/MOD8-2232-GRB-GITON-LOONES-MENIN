import database from "./databaseplièjjk.op)$$456.js";

const findSession = async (id) => {
  const query = "SELECT id, email, start_time, extended_time, expiry_time FROM sessions WHERE id = ?;";
  const [rows] = await database.execute(query, [id]);
  return rows.length > 0 ? mapSession(rows[0]) : null;
};

function mapSession(row) {
  return {
    id: row.id,
    email: row.email,
    startTime: row.start_time,
    extendedTime: row.extended_time,
    expiryTime: row.expiry_time,
  };
}

const createSession = async (session) => {
  const query = "INSERT INTO sessions (email, start_time, expiry_time) VALUES (?, ?, ?);";
  const [result] = await database.execute(query, [session.email, session.startTime, session.expiryTime]);
  if (result.affectedRows > 0) {
    return session;
  }

  throw new Error(`Failed to create session ${session.id}.`);
};

// const extendSession = async (id, extendedTime, expiryTime) => {
//   const query = "UPDATE sessions SET extended_time = ?, expiry_time = ? WHERE id = ?;";
//   const [result] = await database.execute(query, [extendedTime, expiryTime, id]);
//   if (result.affectedRows === 0) {
//     throw new Error(`Failed to extend session ${id}.`);
//   }
// };

const endSession = async (id) => {
  const query = "UPDATE sessions SET expiry_time = ? WHERE id = ?;";
  const date = new Date(Date.now()).toISOString().slice(0, 19).replace("T", " ");
  console.log(date);
  const [result] = await database.execute(query, [new Date(Date.now()).toISOString().slice(0, 19).replace("T", " "), id]);
  if (result.affectedRows === 0) {
    throw new Error(`Failed to end session ${id}.`);
  }
};

const deleteSession = async (id) => {
  const query = "DELETE FROM sessions WHERE id = ?;";
  const [result] = await database.execute(query, [id]);
  return result.affectedRows > 0;
};

const findAllSessions = async () => {
  const query = "SELECT id, email, start_time, extended_time, expiry_time FROM sessions;";
  const [rows] = await database.execute(query);
  return rows.map(mapSession);
};

export default {
  findSession,
  createSession,
  // extendSession,
  deleteSession,
  findAllSessions,
  endSession,
};
