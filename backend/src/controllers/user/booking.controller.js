

import Booking from "../../models/booking.model.js";
import Seat from "../../models/seat.model.js";

export const reserveSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;
    const userId = req.user._id;

    const seats = await Seat.find({
      _id: { $in: seatIds },
      isBooked: false,
      isReserved: false,
    }).populate("event", "title date location");

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked/reserved",
      });
    }

    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        isReserved: true,
        reservedBy: userId,
        reservedAt: new Date(),
      }
    );

    const updatedSeats = await Seat.find({
      _id: { $in: seatIds },
    }).select("seatNumber status");

    res.json({
      success: true,
      message: "Seats reserved successfully",
      event: seats[0]?.event, // ✅ event info
      seats: updatedSeats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const confirmBooking = async (req, res) => {
  try {
    const { seatIds, eventId } = req.body;
    const userId = req.user._id;

    // ✅ Create booking
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      seats: seatIds,
      status: "confirmed",
    });

    // ✅ Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        isBooked: true,
        isReserved: false,
      }
    );

    // ✅ Populate event + seats
    const populatedBooking = await Booking.findById(booking._id)
      .populate("event", "title date location")
      .populate("seats", "seatNumber status");

    res.json({
      success: true,
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


