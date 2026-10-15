import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import protect from "../middleware/requireAuth.js";

const router = express.Router();

const ALLOWED_STATUSES = ["APPROVED", "REJECTED"];

// Pull the logged-in user's id from the auth middleware.
// ← adjust if your middleware sets something other than req.user._id
const getUserId = (req) => req.userId;

/**
 * GET /api/jobs
 * Query: ?validationStatus=PENDING&limit=100
 * Returns only the logged-in user's jobs, newest first.
 */
router.get("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { validationStatus, limit = 100 } = req.query;

    const filter = { userId };
    if (validationStatus) filter.validationStatus = String(validationStatus);

    const jobs = await Job.find(filter)
      .select(
        "company jobTitle location workType url dateFound validationStatus",
      )
      .sort({ dateFound: -1 })
      .limit(Math.min(Number(limit) || 100, 500))
      .lean();

    res.json(jobs);
  } catch (err) {
    console.error("GET /api/jobs failed:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/**
 * PATCH /api/jobs/:id/validation
 * Body: { validationStatus: "APPROVED" | "REJECTED" }
 * Only updates a job owned by the logged-in user.
 */
router.patch("/:id/validation", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { id } = req.params;
    const { validationStatus } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }
    if (!ALLOWED_STATUSES.includes(validationStatus)) {
      return res.status(400).json({ message: "Invalid validationStatus" });
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, userId },
      { validationStatus },
      { new: true, runValidators: true },
    )
      .select(
        "company jobTitle location workType url dateFound validationStatus",
      )
      .lean();

    // 404 for both "missing" and "not yours" so ownership isn't leaked
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error("PATCH /api/jobs/:id/validation failed:", err);
    res.status(500).json({ message: "Failed to update job" });
  }
});

export default router;
