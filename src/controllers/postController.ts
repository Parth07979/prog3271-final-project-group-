// We import Response because we need to send responses back to the client.
import { Response } from "express";

// We import Prisma for database work.
import { prisma } from "../lib/prisma";

// We import our custom AuthRequest type
// so we can safely use req.user after token verification.
import { AuthRequest } from "../middlewares/authMiddleware";

// This function gets all posts from the database.
export const getAllPosts = async (_req: AuthRequest, res: Response) => {
  try {
    // We fetch all posts and also include the author's username.
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    // We send the posts back to the client.
    return res.json(posts);
  } catch (error) {
    // If something breaks, return a server error.
    return res.status(500).json({
      message: "Error fetching posts"
    });
  }
};

// This function creates a new post.
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    // We get title and content from the request body.
    const { title, content } = req.body;

    // We get the logged-in user's id from the token.
    const userId = req.user?.id;

    // We make sure the required values are present.
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    // We make sure we have a logged-in user.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We create the post in the database.
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId
      }
    });

    // We return the created post.
    return res.status(201).json(post);
  } catch (error) {
    // If something unexpected happens, return server error.
    return res.status(500).json({
      message: "Error creating post"
    });
  }
};

// This function updates a post.
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    // We get the post id from the URL parameters.
    const { id } = req.params;

    // We get the updated title and content from the body.
    const { title, content } = req.body;

    // We get the logged-in user id from the token.
    const userId = req.user?.id;

    // We make sure title and content were sent.
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    // We make sure there is a logged-in user.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We find the post first so we can check ownership.
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      }
    });

    // If the post does not exist, return not found.
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

// We find the logged-in user from database.
// This helps us check if the user is normal USER or ADMIN.
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Allow post owner OR admin to update the post.
// If user is not owner and not admin, then block the request.
if (post.authorId !== userId && user?.role !== "ADMIN") {
  return res.status(403).json({
    message: "You can only update your own post"
  });
}

    // We update the post in the database.
    const updatedPost = await prisma.post.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        content
      }
    });

    // We return the updated post.
    return res.json(updatedPost);
  } catch (error) {
    // If anything fails, return a server error.
    return res.status(500).json({
      message: "Error updating post"
    });
  }
};

// This function deletes a post.
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    // We get the post id from the URL.
    const { id } = req.params;

    // We get the current logged-in user id.
    const userId = req.user?.id;

    // If there is no user, we stop here.
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user"
      });
    }

    // We find the post first.
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      }
    });

    // If the post does not exist, return not found.
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Only the owner should be allowed to delete their own post here.
    // Later, when you add admin/super user support,
    // you can extend this condition.
    if (post.authorId !== userId) {
      return res.status(403).json({
        message: "You can only delete your own post"
      });
    }

    // We delete likes linked to this post first.
    await prisma.like.deleteMany({
      where: {
        postId: Number(id)
      }
    });

    // We delete comments linked to this post second.
    await prisma.comment.deleteMany({
      where: {
        postId: Number(id)
      }
    });

    // Finally we delete the post itself.
    await prisma.post.delete({
      where: {
        id: Number(id)
      }
    });

    // We return a success message.
    return res.json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    // If anything breaks, return a server error.
    return res.status(500).json({
      message: "Error deleting post"
    });
  }
};