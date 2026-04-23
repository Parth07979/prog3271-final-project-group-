// Import Router from express
// Router is used to create API routes
import { Router } from "express";

// Import all post-related functions from controller
// These functions handle the logic for posts
import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/postController";

// Import middleware to check if user is logged in
// This verifies the token before allowing access
import { verifyToken } from "../middlewares/authMiddleware";

// Create a new router
const router = Router();

// Route to get all posts
// GET request
// No login required
router.get("/", getAllPosts);

// Route to create a new post
// POST request
// User must be logged in (verifyToken)
router.post("/", verifyToken, createPost);

// Route to update a post
// PUT request
// :id means post id will come from URL
// User must be logged in
router.put("/:id", verifyToken, updatePost);

// Route to delete a post
// DELETE request
// :id means post id will come from URL
// User must be logged in
router.delete("/:id", verifyToken, deletePost);

// Export router so it can be used in app.ts
export default router;