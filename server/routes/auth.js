import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser) {
      return res.status(400).json({ message: "Email or username unavailable" });
    }

    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      firstname,
      lastname,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // identifier can be either username or email
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Username/email and password are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!existingUser) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!existingUser.passwordHash) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const validPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    // Persist refresh token in DB so it can invalidate on logout
    await RefreshToken.create({
      token: refreshToken,
      userId: existingUser._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("Log in Error", error);
    res.status(500).json({ message: "Server error on Login" });
  }
});

// Refresh — issues a new access token if the refresh token cookie is valid
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Check it exists in DB (not already logged out)
    const stored = await RefreshToken.findOne({ token });
    if (!stored) {
      return res
        .status(403)
        .json({ message: "Refresh token invalid or revoked" });
    }

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          // Token expired or tampered — clean it up
          await RefreshToken.deleteOne({ token });
          return res.status(403).json({ message: "Refresh token expired" });
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" },
        );

        return res.json({ accessToken: newAccessToken });
      },
    );
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Server error on refresh" });
  }
});

// Logout — clears cookie and revokes refresh token in DB
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.jwt;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error on logout" });
  }
});

export default router;
