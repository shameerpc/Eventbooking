import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents
} from "../../controllers/admin/event.controller.js";
import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly,getAllEvents);

// CREATE EVENT
router.post("/", protect, adminOnly, createEvent);

// UPDATE EVENT
router.put("/:id", protect, adminOnly, updateEvent);

// DELETE EVENT
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;