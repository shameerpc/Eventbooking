import express from "express";
import { getAllBookings,
      cancelBooking,
  refundBooking,
 } from "../../controllers/admin/booking.controller.js";
import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllBookings);
router.post("/cancel/:bookingId", protect, adminOnly, cancelBooking);
router.post("/refund/:bookingId", protect, adminOnly, refundBooking);

export default router;