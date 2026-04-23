// Import Router from express
// Router is used to create API routes
import { Router } from "express";

// Import register and login functions from controller
// These functions handle user registration and login
import { registerUser, loginUser } from "../controllers/userController";

// Create a new router
const router = Router();

// Route to register a new user
// POST request
// User sends username, email, and password
router.post("/register", registerUser);

// Route to login user
// POST request
// User sends email and password
router.post("/login", loginUser);

// Export router so it can be used in app.ts
export default router;