import express from "express";
import repository from "../persistence/session-repository.js";

const router = express.Router();

// GET request handler for /api/sessions/:id URL
router.get("/sessions/:id", async (req, res, next) => {
  try {
    const session = await repository.findSession(req.params.id);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST request handler for /api/sessions URL
router.post("/sessions", async (req, res, next) => {
  try {
    const session = await repository.createSession(req.body);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// PUT request handler for /api/sessions/:id URL
router.put("/sessions/:id", async (req, res, next) => {
  try {
    const session = await repository.extendSession(req.params.id, req.body.extendedTime, req.body.expiryTime);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// DELETE request handler for /api/sessions/:id URL
router.delete("/sessions/:id", async (req, res, next) => {
  try {
    const success = await repository.deleteSession(req.params.id);
    res.json(success);
  } catch (err) {
    next(err);
  }
});

export default router;