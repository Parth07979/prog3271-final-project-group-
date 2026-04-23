// We import Response because we need to send data back to the client.
import { Response } from "express";

// We import Prisma for database operations.
import { prisma } from "../lib/prisma";

// We import AuthRequest so we can use req.user safely.
import { AuthRequest } from "../middlewares/authMiddleware";

// This function gets all comments for one post.
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    // We take postId from the route parameter.
    const { postId } = req.params;

    // We get all comments that belong to this post.
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(postId)
      },
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    // We return the comments.
    return res.json(comments);
  } catch (error) {
    // If something fails, return an error.
    return res.status(500).json({
      message: "Error fetching comments"
    });
  }
};

// This function creates a new comment for a post.
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    // We get postId from the URL.
    const { postId } = req.params;

    // We get comment content from the request body.
    const { content } = req.body;

    // We get the logged-in user id from the token.
    const userId = req.user?.id;

    // We check if the content is missing.
    if (!content) {
      return res.status(400).json({
        message: "Comment content is required"
      });
    }

    // We check if the user is logged in.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We create the comment in the database.
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: Number(postId)
      }
    });

    // We return the created comment.
    return res.status(201).json(comment);
  } catch (error) {
    // If something fails, return a server error.
    return res.status(500).json({
      message: "Error creating comment"
    });
  }
};

// This function updates a comment.
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    // We get comment id from the URL.
    const { id } = req.params;

    // We get new content from the body.
    const { content } = req.body;

    // We get current user id from token.
    const userId = req.user?.id;

    // We check if content was provided.
    if (!content) {
      return res.status(400).json({
        message: "Comment content is required"
      });
    }

    // We make sure the user is logged in.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We find the comment first.
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    });

    // If the comment does not exist, return not found.
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // Only the comment owner can update it.
    if (comment.authorId !== userId) {
      return res.status(403).json({
        message: "You can only update your own comment"
      });
    }

    // We update the comment.
    const updatedComment = await prisma.comment.update({
      where: {
        id: Number(id)
      },
      data: {
        content
      }
    });

    // We return the updated comment.
    return res.json(updatedComment);
  } catch (error) {
    // If anything fails, return server error.
    return res.status(500).json({
      message: "Error updating comment"
    });
  }
};

// This function deletes a comment.
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    // We get comment id from the URL.
    const { id } = req.params;

    // We get current user id from token.
    const userId = req.user?.id;

    // If there is no user, stop here.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We find the comment first.
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    });

    // If the comment is missing, return not found.
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    // Only the owner can delete the comment here.
    if (comment.authorId !== userId) {
      return res.status(403).json({
        message: "You can only delete your own comment"
      });
    }

    // We delete the comment.
    await prisma.comment.delete({
      where: {
        id: Number(id)
      }
    });

    // We return success.
    return res.json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    // If anything fails, return server error.
    return res.status(500).json({
      message: "Error deleting comment"
    });
  }
};