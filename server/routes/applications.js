import express from "express";
import Application from "../models/Application.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// GET all applications for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .populate("companyId", "name")
      .sort({ lastUpdated: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new application
router.post("/", requireAuth, async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update an application (status, notes, etc.)
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, lastUpdated: Date.now() },
      { new: true },
    );
    if (!application) return res.status(404).json({ error: "Not found" });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an application
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!application) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
