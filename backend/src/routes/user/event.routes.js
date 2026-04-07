import express from "express";
import {
  getAllEvents,
  getEventById,
  getEventSeats, // ✅ Import the new controller
} from "../../controllers/user/event.controller.js";

const router = express.Router();

// ✅ Get all events
router.get("/", getAllEvents);

// ✅ Get seats for a specific event (Must come before /:eventId if you had dynamic routes overlapping, but here it is distinct)
router.get("/:eventId/seats", getEventSeats);

// ✅ Get single event
router.get("/:eventId", getEventById);

export default router;