import Event from "../../models/event.model.js";

// ✅ Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get single event details
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ NEW: Get seats for a specific event
export const getEventSeats = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event specifically to get its seats
    // Assuming 'seats' is an array inside your Event Model
    const event = await Event.findById(eventId).select("seats name date location");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      seats: event.seats || [], // Return the seats array (or empty if none)
      // Optionally return event details if your frontend needs them for the header
      eventDetails: {
        name: event.name,
        date: event.date,
        location: event.location,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};