import User from "../../models/user.model.js"; // Check this path: assumes src/models/User.js
import jwt from "jsonwebtoken";

// 1. Define this helper function FIRST
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key", {
    expiresIn: "30d",
  });
};

// @desc    Auth Admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 2. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check if password matches
    if (await user.matchPassword(password)) {
      
      // 4. CRITICAL: Check if role is 'admin'
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized as an admin" });
      }

      // 5. Return success with token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};