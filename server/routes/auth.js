import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body

        if (!password || typeof password !== "string") {
            return res.status(400).json({ message: "Password is required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (existingUser) {
            return res.status(400).json({ message: "Email or username unavailable" })
        }

        const newUser = new User({ username, email, passwordHash: hashedPassword, firstname, lastname });

        await newUser.save();

        res.status(201).json({ message: "User registered" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body

        if (!identifier || !password) {
            return res.status(400).json({ message: "Username/email and password are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
        if (!existingUser) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!existingUser.passwordHash) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const validPassword = await bcrypt.compare(password, existingUser.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: existingUser._id, username: existingUser.username } });
        
    } catch (error) {
        console.error("Log in Error", error);
        res.status(500).json({ message: "Server error on Login" });
    }
})

export default router;