import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import companyRouter from "./routes/companies.js";
import applicationRouter from "./routes/applications.js";
import jobRouter from "./routes/jobRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://fletch-net.io",
  "https://www.fletch-net.io",
  "http://localhost:5173",
  /https:\/\/job-hunter-.*-jfletc6s-projects\.vercel\.app/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin),
      );
      allowed
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, { dbName: "job-hunter" })
  .then(() => console.log("Successfully connected to MongoDB via Mongoose!"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/companies", companyRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/jobs", jobRouter);

app.get("/", (req, res) => res.send("Job Hunter API is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
