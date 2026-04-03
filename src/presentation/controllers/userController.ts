import { Request, Response } from "express";

export const registerUser = (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "user"
    };

    res.status(201).json({
        message: "User registered successfully",
        user
    });
};