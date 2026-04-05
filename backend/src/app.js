import express from "express";
import cors from "cors";
// import dotenv from "dotenv"; // Uncomment if you use dotenv
// dotenv.config();

// USER ROUTES
import authRoutes from "./routes/user/auth.routes.js";
import walletRoutes from "./routes/user/wallet.routes.js";
import userEventRoutes from "./routes/user/event.routes.js";
import userSeatRoutes from "./routes/user/seat.routes.js";
import bookingRoutes from "./routes/user/booking.routes.js";

// ADMIN ROUTES
import adminEventRoutes from "./routes/admin/event.routes.js";
import adminSeatRoutes from "./routes/admin/seat.routes.js";
import adminTransactionRoutes from "./routes/admin/transaction.routes.js";
import adminBookingRoutes from "./routes/admin/booking.routes.js";

// FIX 1: Corrected the import statement for Admin Auth
import adminAuthRoutes from "./routes/admin/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// USER APIs
app.use("/api/user/auth", authRoutes);
app.use("/api/user/wallet", walletRoutes);
app.use("/api/user/events", userEventRoutes);
app.use("/api/user/seats", userSeatRoutes);
app.use("/api/user/bookings", bookingRoutes);

// ADMIN APIs
app.use("/api/admin/events", adminEventRoutes);
app.use("/api/admin/seats", adminSeatRoutes);
app.use("/api/admin/transactions", adminTransactionRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);

// FIX 2: Corrected Route Mounting
// We mount at /api/admin, and the route file handles /login -> Final URL: /api/admin/login
app.use("/api/admin", adminAuthRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

export default app;