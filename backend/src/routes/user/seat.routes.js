import express from "express";
import { getSeatsByEvent } from "../../controllers/user/seat.controller.js";

const router = express.Router();

// GET seats by event
router.get("/event/:eventId", getSeatsByEvent);

export default router;