import express from "express";
import users from "./users.js";
import transactions from "./transactions.js";
import auth from "./auth.js";

const router = express.Router();

router.use(users);
router.use(transactions);
router.use(auth);

export default router;