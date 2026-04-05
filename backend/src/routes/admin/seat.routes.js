import express from "express";
import { createSeats } from "../../controllers/admin/seat.controller.js";
import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ GET seats by event

router.post("/", protect, adminOnly, createSeats);

export default router;