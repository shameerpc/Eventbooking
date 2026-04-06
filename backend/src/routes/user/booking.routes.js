import express from "express";
import {
  reserveSeats,
  confirmBooking,
  getUserBookings, // ✅ Import the new function
} from "../../controllers/user/booking.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Add this GET route (Handles GET /api/user/bookings)
router.get("/", protect, getUserBookings);

router.post("/reserve", protect, reserveSeats);
router.post("/confirm", protect, confirmBooking);

export default router;