import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
    set: (v) => v.replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  lastname: {
    type: String,
    required: true,
    set: (v) => v.replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  timezone: {
    type: String,
    default: "UTC",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
