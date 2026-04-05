import express from "express";
import {
  getAllEvents,
  getEventById,
} from "../../controllers/user/event.controller.js";

const router = express.Router();

// ✅ Get all events
router.get("/", getAllEvents);

// ✅ Get single event
router.get("/:eventId", getEventById);

export default router;