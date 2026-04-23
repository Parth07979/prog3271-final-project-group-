// We import express because this is the main framework used to build the backend.
import express, { NextFunction, Request, Response } from "express";

// We import all route files.
// Each route file handles one area of the application.
import userRoutes from "../routes/userRoutes";
import postRoutes from "../routes/postRoutes";
import commentRoutes from "../routes/commentRoutes";
import likeRoutes from "../routes/likeRoutes";
import adminRoutes from "../routes/adminRoutes";

// We create the Express application.
const app = express();

// This middleware allows the app to read JSON data from requests.
// For example, when a user sends login data or creates a post.
app.use(express.json());

// This middleware logs every request
// It shows method (GET, POST, etc) and URL in terminal
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // move to next middleware or route
});
// This is a simple test route.
// It helps us quickly check if the API is alive in the browser or Postman.
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Forum backend is running" });
});

// These are the main route groups for the project.
// Each one sends requests to the correct route file.
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/posts/:postId/likes", likeRoutes);
app.use("/api/admin", adminRoutes);

// This is the global error handler.
// If any route throws an unexpected error, it will come here.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // We log the full error in the terminal for debugging.
  console.error("Unhandled error:", err.message);

  // We return a safe message to the client.
  res.status(500).json({
    message: "Something went wrong on the server"
  });
});

// We export the app so index.ts can start it.
export default app;