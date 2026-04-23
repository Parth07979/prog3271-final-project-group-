// We import Request and Response for handling API requests and responses.
import { Request, Response } from "express";

// We use bcryptjs to hash passwords before saving them.
import bcrypt from "bcryptjs";

// We use jsonwebtoken to create login tokens.
import jwt from "jsonwebtoken";

// We import Prisma so we can talk to the database.
import { prisma } from "../lib/prisma";

// This function handles user registration.
export const registerUser = async (req: Request, res: Response) => {
  try {
    // We take the values sent from the client.
    const { username, email, password } = req.body;

    // We check if any required value is missing.
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required"
      });
    }

    // We check if the email is already being used.
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    // If the email already exists, we should not create another user.
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    // We hash the password so the real password is not stored in plain text.
    const hashedPassword = await bcrypt.hash(password, 10);

    // We create the new user in the database.
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    // We return a success response.
    // We do not return the password.
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    // If something unexpected happens, we return a server error.
    return res.status(500).json({
      message: "Error registering user"
    });
  }
};

// This function handles user login.
export const loginUser = async (req: Request, res: Response) => {
  try {
    // We get email and password from the request body.
    const { email, password } = req.body;

    // We make sure the user sent both values.
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // We search for the user by email.
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // If no user is found, login fails.
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // We compare the entered password with the hashed password in the database.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If the password does not match, login fails.
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // We create a JWT token.
    // This token will be used to access protected routes.
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h"
      }
    );

    // We return the token to the user.
    return res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    // If anything goes wrong, return a server error.
    return res.status(500).json({
      message: "Error logging in"
    });
  }
};