import express from "express";
import {
  reserveSeats,
  confirmBooking,
} from "../../controllers/user/booking.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveSeats);
router.post("/confirm", protect, confirmBooking);

export default router;