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


// ✅ Virtual status (for frontend ease)
seatSchema.virtual("status").get(function () {
  if (this.isBooked) return "booked";
  if (this.isReserved) return "reserved";
  return "available";
});


// ✅ Include virtuals in JSON response
seatSchema.set("toJSON", { virtuals: true });
seatSchema.set("toObject", { virtuals: true });


export default mongoose.model("Seat", seatSchema);