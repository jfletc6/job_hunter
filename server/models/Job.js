import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    workType: { type: String, trim: true }, // e.g. Remote / Hybrid / On-site
    url: { type: String, required: true, trim: true },
    dateFound: { type: Date, default: Date.now },
    status: { type: String, default: "new" },
    validationStatus: { type: String, default: "pending" },
  },
  {
    // Pin the collection name in case the pipeline created it outside Mongoose
    collection: "jobs",
  },
);

// Speeds up the review query (filter by validation, newest first)
jobSchema.index(
  { userId: 1, url: 1, validationStatus: 1, dateFound: -1 },
  { unique: true },
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
