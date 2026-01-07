import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import user from "./Routes/UserRouter.js";

const upload = multer();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  if (req.files) {
    console.log("Files:", req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname })));
  }
  next();
});

// MongoDB
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", user);

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
