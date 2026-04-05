import Seat from "../../models/seat.model.js";

export const getSeatsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const seats = await Seat.find({ event: eventId });

    res.status(200).json({
      success: true,
      count: seats.length,
      seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


