import mongoose from "mongoose";

const GmailConnectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  googleAccountId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  encryptedAccessToken: {
    type: String,
    required: true,
  },
  encryptedRefreshToken: {
    type: String,
    required: true,
  },
  tokenExpiry: {
    type: Date,
    required: true,
  },
  scopes: {
    type: [String],
    required: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
  syncStatus: {
    type: String,
    enum: ["pending", "in_progress", "completed", "failed"],
    default: "pending",
  },
  lastSyncError: {
    type: String,
  },
});

export default mongoose.model("GmailConnection", GmailConnectionSchema);
