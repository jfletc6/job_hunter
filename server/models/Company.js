import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    set: (v) => v.replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  url: {
    type: String,
    required: true,
  },
  keywords: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
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

// Enforce uniqueness per-user instead of globally
companySchema.index({ userId: 1, url: 1 }, { unique: true });

export default mongoose.model("Company", companySchema);
