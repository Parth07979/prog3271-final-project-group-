// Import Request and Response from express
// Request = incoming request from client
// Response = what we send back to client
import { Request, Response } from "express";

// Import prisma to interact with the database
import { prisma } from "../lib/prisma";

// This function gives overall site statistics
export const getStats = async (_req: Request, res: Response) => {
  try {
    // Count total number of users in database
    const users = await prisma.user.count();

    // Count total number of posts in database
    const posts = await prisma.post.count();

    // Count total number of comments in database
    const comments = await prisma.comment.count();

    // Count total number of likes in database
    const likes = await prisma.like.count();

    // Send all counts as response
    return res.json({
      users,
      posts,
      comments,
      likes
    });
  } catch (error) {
    // If something goes wrong, send error response
    return res.status(500).json({
      message: "Error fetching stats"
    });
  }
};