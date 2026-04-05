import express from "express";
import { getAllTransactions } from "../../controllers/admin/transaction.controller.js";
import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllTransactions);

export default router;