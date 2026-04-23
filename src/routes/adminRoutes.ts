// Import Router from express
// Router is used to create API routes
import { Router } from "express";

// Import getStats function from admin controller
// This function returns overall site statistics
import { getStats } from "../controllers/adminController";

// Import verifyToken middleware
// This checks if user is logged in
import { verifyToken } from "../middlewares/authMiddleware";

// Import isAdmin middleware
// This checks if user is ADMIN
import { isAdmin } from "../middlewares/adminMiddleware";

// Create a new router
const router = Router();

// This route gets admin statistics
// First verify token (user must be logged in)
// Then check if user is admin
// Then run getStats function
router.get("/stats", verifyToken, isAdmin, getStats);

// Export router so it can be used in app.ts
export default router;