// Import Request, Response, and NextFunction from express
// Request = incoming data from client
// Response = what we send back to client
// NextFunction = used to move to next middleware or controller
import { Request, Response, NextFunction } from "express";

// Import jsonwebtoken to verify JWT token
import jwt from "jsonwebtoken";

// Create a custom request type that includes user info
// After token verification, we store user data in req.user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

// This middleware checks if token is valid
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get Authorization header from request
    const authHeader = req.headers.authorization;

    // If no header, user is not authorized
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is required" });
      return;
    }

    // Extract token from "Bearer token_here"
    const token = authHeader.split(" ")[1];

    // If token is missing, return error
    if (!token) {
      res.status(401).json({ message: "Token is required" });
      return;
    }

    // Verify token using secret key from .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: number;
      username: string;
    };

    // Save user info inside request
    req.user = decoded;

    // Move to next middleware or controller
    next();
  } catch (error) {
    // If token is invalid or expired, return error
    res.status(401).json({ message: "Invalid or expired token" });
  }
};