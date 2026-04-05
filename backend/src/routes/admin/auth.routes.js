import express from "express";
import { loginAdmin } from "../../controllers/admin/auth.controller.js";

const router = express.Router();

// This matches: POST /api/admin/login
router.post("/login", loginAdmin);

// IMPORTANT: Must use 'export default' because app.js uses 'import X from ...'
export default router;