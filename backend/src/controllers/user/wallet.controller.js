import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Transaction from "../../models/transaction.model.js";
import Booking from "../../models/booking.model.js";
import Seat from "../../models/seat.model.js";

export const payWithWallet = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { seatIds, eventId, totalAmount } = req.body;
    const userId = req.user._id;

    if (!seatIds?.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    const amountInPaise = Math.round(totalAmount * 100);

    session.startTransaction();

    // ✅ Get user with lock
    const user = await User.findById(userId).session(session);

    if (!user || user.walletBalance < amountInPaise) {
      throw new Error("Insufficient balance");
    }

    // ✅ Validate seats (IMPORTANT)
    const seats = await Seat.find({
      _id: { $in: seatIds },
      status: "RESERVED",
      reservedBy: userId,
      reservedAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }, // not expired
    }).session(session);

    if (seats.length !== seatIds.length) {
      throw new Error("Seats expired or unavailable");
    }

    // ✅ Deduct wallet
    user.walletBalance -= amountInPaise;
    await user.save({ session });

    // ✅ Create booking
    const booking = await Booking.create(
      [
        {
          user: userId,
          event: eventId,
          seats: seatIds,
          totalAmount: amountInPaise,
          status: "CONFIRMED",
          paymentStatus: "SUCCESS",
        },
      ],
      { session }
    );

    // ✅ Update seats → BOOKED
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        status: "BOOKED",
        booking: booking[0]._id,
      },
      { session }
    );

    // ✅ Transaction ledger
    await Transaction.create(
      [
        {
          userId,
          type: "DEBIT",
          amount: amountInPaise,
          balanceAfter: user.walletBalance,
          description: `Booking ${booking[0]._id}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate("event", "title date location")
      .populate("seats", "seatNumber");

    res.status(200).json({
      success: true,
      message: "Payment successful",
      booking: populatedBooking,
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

// 💰 Add Money
export const addMoney = async (req, res) => {
  try {
    const userId = req.user._id;
    let { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const amountInPaise = Math.round(amount * 100);

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amountInPaise } },
      { new: true }
    );

    await Transaction.create({
      userId,
      type: "CREDIT",
      amount: amountInPaise,
      balanceAfter: user.walletBalance,
      description: "Wallet top-up",
    });

    res.json({
      success: true,
      balance: user.walletBalance,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📜 Transaction History
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .select("type amount balanceAfter description createdAt");

    res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};