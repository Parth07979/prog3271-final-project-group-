// Import Router from express
// Router is used to create routes (API endpoints)
import { Router } from "express";

// Import like and unlike functions from controller
// These functions handle the actual logic
import { likePost, unlikePost } from "../controllers/likeController";

// Import middleware to check if user is logged in
// This verifies the token before allowing access
import { verifyToken } from "../middlewares/authMiddleware";

// Create a new router
// mergeParams: true allows us to access postId from parent route
const router = Router({ mergeParams: true });

// Route to like a post
// POST request
// First it checks token (verifyToken)
// Then it runs likePost function
router.post("/", verifyToken, likePost);

// Route to unlike a post
// DELETE request
// First it checks token
// Then it runs unlikePost function
router.delete("/", verifyToken, unlikePost);

// Export this router so it can be used in app.ts
export default router;