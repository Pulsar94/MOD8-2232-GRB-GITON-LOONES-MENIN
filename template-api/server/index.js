import "dotenv/config";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import compression from "compression";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import repository from "./persistence/repository.js";

// Get environment defined by cross-env in package.json
// const environment = process.env.NODE_ENV
// if (!environment) {
//   throw new Error('Environment is not defined.')
// }

// Create Express application object
const app = express();

// Morgan request logger middleware
app.use(logger("dev"));

// Helmet security middleware, configured with Content-Security-Policy response header
// in order to enable client-side scripts to call API at origin specified in .env

// app.use(helmet({ contentSecurityPolicy: { directives: { 'default-src': ["'self'", process.env.API_ORIGIN] } } }))
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://www.gstatic.com", "'unsafe-eval'"],
    },
  })
);

// Compression middleware for compressing response bodies
app.use(compression());

// Express static file middleware that serves files from Vue single-page application build path
const clientBuildPath = join(dirname(fileURLToPath(import.meta.url)), "../client/dist");
app.use(express.static(clientBuildPath));

// GET request handler for /api/health URL
app.get("/api/health", (req, res) => res.json({ status: "UP" }));

// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status ?? 500; // Get error status or use default status 500
  const isServerError = status >= 500;

  console.error(isServerError ? err : `${status}: ${err.message}`); // Log error in server console
  const message = isServerError ? "Something went wrong." : err.message; // Create client-friendly message

  res.status(status).send(message); // Send client-friendly error message
});

// GET request handler for /api/transactions/:UserId URL
app.get("/api/transactions/:userId", async (req, res, next) => {
  try {
    const transactions = await repository.getTransactionsByUserId(req.params.userId);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// GET request handler for /api/transactions URL
app.get("/api/transactions", async (req, res, next) => {
  try {
    const transactions = await repository.getTransactions();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// GET request handler for /api/users URL
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await repository.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET request handler for /api/users/:mail URL
app.get("/api/users/:mail", async (req, res, next) => {
  try {
    const user = await repository.getUserByMail(req.params.mail);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST request handler for /api/transactions URL
app.post("/api/transactions", async (req, res, next) => {
  try {
    const transaction = await repository.createTransaction(req.body);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

// PUT request handler for /api/users URL
app.put("/api/users", async (req, res, next) => {
  try {
    const user = await repository.editUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});


// // GET request handler for all other URLs that returns index.html of Vue single-page application
// const indexPath = join(clientBuildPath, "index.html");
// app.get("*", (req, res) => res.sendFile(indexPath));


// Start listening for client requests
const port = 8081; //process.env.PORT
app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
