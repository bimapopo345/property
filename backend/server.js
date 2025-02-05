import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/mongodb.js";
import cors from "cors";
import propertyrouter from "./routes/ProductRouter.js";
import userrouter from "./routes/UserRoute.js";
import formrouter from "./routes/formrouter.js";
import newsrouter from "./routes/newsRoute.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import { logInfo, logError, requestLogger } from "./utils/logger.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(requestLogger); // Add request logging

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://real-estate-website-backend-fullcode.onrender.com",
      "https://real-estate-website-sepia-two.vercel.app",
      "https://real-estate-backend-gamma-nine.vercel.app/",
      "http://localhost:5174",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Database connection
connectdb()
  .then(() => {
    logInfo("Database connected successfully");
  })
  .catch((err) => {
    logError("Database connection error:", { error: err });
  });

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/products", propertyrouter);
app.use("/api/users", userrouter);
app.use("/api/forms", formrouter);
app.use("/news", newsrouter);
app.use("/api/appointments", appointmentRouter);

// Global error handler
app.use((err, req, res, next) => {
  logError("Application error:", {
    error: err,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Handle 404
app.use("*", (req, res) => {
  logInfo("Resource not found", {
    path: req.originalUrl,
    method: req.method,
  });

  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

const port = process.env.PORT || 4000;

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, "0.0.0.0", () => {
    logInfo(`Server running on port ${port}`, {
      port,
      nodeEnv: process.env.NODE_ENV,
    });
  });
}

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  logError("UNHANDLED REJECTION! 💥 Shutting down...", {
    error: err,
    stack: err.stack,
  });

  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 100);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logError("UNCAUGHT EXCEPTION! 💥 Shutting down...", {
    error: err,
    stack: err.stack,
  });

  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 100);
});

app.get("/", (req, res) => {
  res.send(`
      <html>
        <head>
          <title>API Status</title>
        </head>
        <body>
          <h1>API is working</h1>
          <p>Welcome to the Real Estate API. Everything is running smoothly.</p>
        </body>
      </html>
    `);
});

export default app;
