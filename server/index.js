const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const logRoutes = require("./routes/logRoutes");

const app = express();

// Middleware
app.use(helmet());

// ✅ Fixed CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://security-audit-dashboard-chi.vercel.app",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(compression());
app.use(express.json({ limit: process.env.MAX_UPLOAD_SIZE || "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.MAX_UPLOAD_SIZE || "50mb",
  }),
);

// Routes
app.use("/api/logs", logRoutes);

// Health check endpoint (optional but helpful)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `✅ CORS enabled for: http://localhost:3000, https://security-audit-dashboard-chi.vercel.app`,
  );
});

module.exports = app;
