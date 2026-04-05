
import mongoose from "mongoose";
import Booking from "../../models/booking.model.js";
import Seat from "../../models/seat.model.js";
import User from "../../models/user.model.js";
import Transaction from "../../models/transaction.model.js";



export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title")
      .populate("seats", "seatNumber")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookingId } = req.params;

    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) throw new Error("Booking not found");

    if (booking.status === "CANCELLED") {
      throw new Error("Booking already cancelled");
    }

    // ❗ Prevent cancel after refund
    if (booking.paymentStatus === "REFUNDED") {
      throw new Error("Already refunded booking");
    }

    booking.status = "CANCELLED";
    await booking.save({ session });

    // ✅ Release seats safely
    await Seat.updateMany(
      {
        _id: { $in: booking.seats },
        status: { $in: ["BOOKED", "RESERVED"] },
      },
      {
        status: "AVAILABLE",
        reservedBy: null,
        reservedAt: null,
        booking: null,
      },
      { session }
    );

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};



export const refundBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookingId } = req.params;

    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) throw new Error("Booking not found");

    // ✅ Prevent duplicate refund
    if (booking.paymentStatus === "REFUNDED") {
      throw new Error("Already refunded");
    }

    if (booking.paymentStatus !== "SUCCESS") {
      throw new Error("Payment not completed");
    }

    const user = await User.findById(booking.user).session(session);
    if (!user) throw new Error("User not found");

    // ✅ Refund wallet
    user.walletBalance += booking.totalAmount;
    await user.save({ session });

    // ✅ Update booking
    booking.status = "CANCELLED";
    booking.paymentStatus = "REFUNDED";
    await booking.save({ session });

    // ✅ Release seats ONLY if they were booked
    await Seat.updateMany(
      {
        _id: { $in: booking.seats },
        status: "BOOKED",
      },
      {
        status: "AVAILABLE",
        reservedBy: null,
        reservedAt: null,
        booking: null,
      },
      { session }
    );

    // ✅ Ledger entry
    await Transaction.create(
      [
        {
          userId: user._id,
          type: "REFUND",
          amount: booking.totalAmount,
          balanceAfter: user.walletBalance,
          description: `Refund for booking ${booking._id}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Refund successful",
      balance: user.walletBalance,
    });

  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};