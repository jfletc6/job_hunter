import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import companyRouter from "./routes/companies.js";
import applicationRouter from "./routes/applications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://www.fletch-net.io", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
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

app.get("/", (req, res) => res.send("Job Hunter API is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
