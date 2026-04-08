import Event from "../../models/event.model.js";
import Seat from "../../models/seat.model.js"; // ✅ REQUIRED: Import Seat model

// ✅ GET ALL EVENTS
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE EVENT
// This was missing from your previous snippet
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SEATS FOR AN EVENT
// This was missing and causing your 404 issue
export const getEventSeats = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find all seats that belong to this event
    // Note: Ensure your Seat model has a field named 'event' (or 'eventId') referencing the Event ID
    const seats = await Seat.find({ event: eventId }).sort({ seatNumber: 1 });

    // Even if seats is an empty array [], we return 200 OK.
    // We only return 404 if the Event ID format is completely invalid (optional check).
    
    res.status(200).json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, totalSeats } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      totalSeats,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};