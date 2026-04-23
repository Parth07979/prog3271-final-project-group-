// Import Request and Response from express
// Request = incoming data from client
// Response = what we send back to client
import { Request, Response } from "express";

// Import prisma to interact with database
import { prisma } from "../lib/prisma";

// Function to like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    // Get postId from URL parameters
    const { postId } = req.params;

    // Get logged-in user id from request (added by auth middleware)
    const userId = (req as any).user.id;

    // Create a new like entry in database
    const like = await prisma.like.create({
      data: {
        userId, // which user liked
        postId: Number(postId) // which post is liked
      }
    });

    // Send success response with created like
    res.status(201).json(like);
  } catch (error) {
    // If something goes wrong, send error response
    res.status(500).json({ message: "Error liking post", error });
  }
};

// Function to unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    // Get postId from URL parameters
    const { postId } = req.params;

    // Get logged-in user id from request
    const userId = (req as any).user.id;

    // Delete like from database where user and post match
    await prisma.like.deleteMany({
      where: {
        userId, // user who liked
        postId: Number(postId) // post that was liked
      }
    });

    // Send success message
    res.json({ message: "Unliked successfully" });
  } catch (error) {
    // If error happens, send error response
    res.status(500).json({ message: "Error unliking post", error });
  }
};