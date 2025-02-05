import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/mongodb.js";
import { logInfo, logError } from "./utils/logger.js";
import propertyrouter from "./routes/ProductRouter.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
  });
  next();
});

// Routes
app.use("/api/products", propertyrouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logError("Server error:", { error: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

// Connect to database
console.log("Connecting to MongoDB...");
console.log("MONGO_URI:", process.env.MONGO_URI);

connectdb()
  .then(() => {
    logInfo("Database connected successfully");

    // Start server
    const port = 4000;
    const server = app.listen(port, () => {
      logInfo(`Test server running on port ${port}`);

      // Make a test request
      console.log("Making test request to /api/products/list...");

      setTimeout(async () => {
        try {
          const response = await fetch(
            "http://localhost:4000/api/products/list"
          );
          const data = await response.json();
          logInfo("Test request successful", { data });

          // Close server and exit
          server.close(() => {
            console.log("Server closed.");
            process.exit(0);
          });
        } catch (error) {
          logError("Test request failed", { error: error.message });
          server.close(() => {
            console.log("Server closed due to error.");
            process.exit(1);
          });
        }
      }, 1000); // Wait 1 second for server to be ready
    });
  })
  .catch((err) => {
    logError("Database connection error:", { error: err.message });
    process.exit(1);
  });

// Handle process termination
process.on("SIGTERM", () => {
  logInfo("Received SIGTERM. Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logInfo("Received SIGINT. Shutting down...");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  logError("Uncaught exception:", { error: err.stack });
  process.exit(1);
});
