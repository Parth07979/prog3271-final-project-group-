// Import Response and NextFunction from express
// Response = used to send response back
// NextFunction = used to move to next middleware
import { Response, NextFunction } from "express";

// Import AuthRequest type (this has user info after login)
import { AuthRequest } from "./authMiddleware";

// Import prisma to access database
import { prisma } from "../lib/prisma";

// This middleware checks if the user is ADMIN
export const isAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    // Get logged-in user's id from token
    const userId = req.user?.id;

    // If no user found, return unauthorized
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user in database using id
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    // Check if user role is ADMIN
    if (user?.role !== "ADMIN") {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    // If user is admin, go to next step (controller)
    next();
};