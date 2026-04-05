import Seat from "../../models/seat.model.js";

export const createSeats = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    if (!eventId || !seats) {
      return res.status(400).json({
        success: false,
        message: "Event ID and seats are required",
      });
    }

    let seatData = [];

    // ✅ CASE 1: seats is a number → auto generate
    if (typeof seats === "number") {
      for (let i = 1; i <= seats; i++) {
        seatData.push({
          event: eventId,
          seatNumber: `A${i}`, // A1, A2...
        });
      }
    }

    // ✅ CASE 2: seats is array
    else if (Array.isArray(seats)) {
      seatData = seats.map((seat) => ({
        event: eventId,
        seatNumber: seat,
      }));
    }

    // ❌ Invalid type
    else {
      return res.status(400).json({
        success: false,
        message: "Seats must be number or array",
      });
    }

    const createdSeats = await Seat.insertMany(seatData, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      message: "Seats created successfully",
      count: createdSeats.length,
      seats: createdSeats,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Some seats already exist (duplicates skipped)",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};