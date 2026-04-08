import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // ✅ Price is usually stored on the Event, but if it's on the seat, keep it here.
    // Ensure this matches how you calculate totals later.
    price: {
      type: Number,
      default: 0,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },

    isReserved: {
      type: Boolean,
      default: false,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reservedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate seats per event
seatSchema.index({ event: 1, seatNumber: 1 }, { unique: true });

// ✅ Ensure no invalid state (booked overrides reserved)
seatSchema.pre("save", function (next) {
  if (this.isBooked) {
    this.isReserved = false;
    this.reservedBy = null;
    this.reservedAt = null;
  }
  next();
});

// ✅ FIX: Virtual status (Returning Uppercase to match Frontend)
seatSchema.virtual("status").get(function () {
  if (this.isBooked) return "BOOKED"; // Frontend expects this
  if (this.isReserved) return "RESERVED"; // Frontend expects this
  return "AVAILABLE"; // Frontend expects this
});

// ✅ Include virtuals in JSON response
seatSchema.set("toJSON", { virtuals: true });
seatSchema.set("toObject", { virtuals: true });

export default mongoose.model("Seat", seatSchema);