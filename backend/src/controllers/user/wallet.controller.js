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

    // ✅ FIX: Removed * 100 logic. We now use the exact amount passed.
    const finalAmount = parseFloat(totalAmount);

    session.startTransaction();

    // ✅ Get user with lock
    const user = await User.findById(userId).session(session);

    if (!user || user.walletBalance < finalAmount) {
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

    // ✅ Deduct wallet (using exact amount)
    user.walletBalance -= finalAmount;
    await user.save({ session });

    // ✅ Create booking
    const booking = await Booking.create(
      [
        {
          user: userId,
          event: eventId,
          seats: seatIds,
          totalAmount: finalAmount, // Store exact amount
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

    // ✅ Transaction ledger (using exact amount)
    await Transaction.create(
      [
        {
          userId,
          type: "DEBIT",
          amount: finalAmount,
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

    // ✅ FIX: Convert to float instead of multiplying by 100
    const finalAmount = parseFloat(amount);

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: finalAmount } }, // Add exact amount
      { new: true }
    );

    await Transaction.create({
      userId,
      type: "CREDIT",
      amount: finalAmount,
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