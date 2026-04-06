import Event from "../../models/event.model.js";

// ✅ GET ALL EVENTS
// Returns: Array of events directly
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    // FIX: Return the array directly, not wrapped in an object
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CREATE EVENT
// Returns: The created event object directly
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

    // FIX: Return the event object directly so React can add it to the list
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE EVENT
// Returns: The updated event object directly
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

    // FIX: Return the updated event directly
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE EVENT
// Returns: Success message (Frontend handles the state update locally)
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