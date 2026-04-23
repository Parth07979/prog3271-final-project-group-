// We import Router to create Express routes.
import { Router } from "express";

// We import all comment controller functions.
import {
  getComments,
  createComment,
  updateComment,
  deleteComment
} from "../controllers/commentController";

// We import the token verification middleware
// so only logged-in users can create, update, or delete comments.
import { verifyToken } from "../middlewares/authMiddleware";

// mergeParams: true is important here because this route is nested under posts.
// That allows us to read postId from the parent route.
const router = Router({ mergeParams: true });

// This route gets all comments for one post.
router.get("/", getComments);

// This route creates a new comment for one post.
// A token is required.
router.post("/", verifyToken, createComment);

// This route updates one specific comment.
// A token is required.
router.put("/:id", verifyToken, updateComment);

// This route deletes one specific comment.
// A token is required.
router.delete("/:id", verifyToken, deleteComment);

// We export the router so app.ts can use it.
export default router;