import express from "express";
import repository from "../persistence/user-repository.js";

const router = express.Router();

// GET request handler for /api/users URL
router.get("/users", async (req, res, next) => {
  try {
    const users = await repository.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST request handler for /api/user URL
router.post("/user", async (req, res, next) => {
  try {
    const user = await repository.getUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT request handler for /api/users URL
router.put("/users", async (req, res, next) => {
  try {
    const user = await repository.editUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST request handler for /api/users URL
router.post("/users", async (req, res, next) => {
  try {
    const user = await repository.createUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET request handler for /api/users/:email URL
router.get("/users/:email", async (req, res, next) => {
  try {
    const user = await repository.getUserByEmail(req.params.email);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;