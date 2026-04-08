import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

   price: {
  type: Number, // in paise
  required: true,
  min: 0,
},

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// 🔥 Optional: index for faster queries
eventSchema.index({ date: 1 });

export default mongoose.model("Event", eventSchema);