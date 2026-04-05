import express from "express";
import {
  addMoney,
  getTransactions,
  payWithWallet,
} from "../../controllers/user/wallet.controller.js"; // ✅ FIXED IMPORT

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addMoney);
router.get("/transactions", protect, getTransactions);
router.post("/wallet-pay", protect, payWithWallet);

export default router;