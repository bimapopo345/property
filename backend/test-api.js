import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import connectdb from "./config/mongodb.js";
import { logInfo, logError } from "./utils/logger.js";
import propertyrouter from "./routes/ProductRouter.js";

// Load environment variables
dotenv.config();

console.log("Environment variables loaded:");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/products", propertyrouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ error: err.message });
});

// Connect to database and start server
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await connectdb();
    console.log("MongoDB Connected:", conn.connection.host);

    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
      console.log(`Test server running on port ${port}`);

      // Make test requests after a short delay to ensure server is ready
      setTimeout(() => {
        testEndpoints(port)
          .then(() => {
            console.log("Tests completed successfully");
            server.close(() => {
              process.exit(0);
            });
          })
          .catch((error) => {
            console.error("Tests failed:", error);
            server.close(() => {
              process.exit(1);
            });
          });
      }, 1000);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

async function testEndpoints(port) {
  try {
    console.log("Testing GET /api/products/list endpoint...");
    const url = `http://localhost:${port}/api/products/list`;
    console.log("Request URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response received:", JSON.stringify(data, null, 2));

    if (data.property && Array.isArray(data.property)) {
      console.log(`Found ${data.property.length} properties`);
      if (data.property.length > 0) {
        console.log(
          "First property:",
          JSON.stringify(data.property[0], null, 2)
        );
      } else {
        console.log("No properties found in database");
      }
    } else {
      console.log("Unexpected response format:", data);
    }

    return data;
  } catch (error) {
    console.error("API test error:", error);
    logError("API test failed", { error });
    throw error;
  }
}

console.log("Starting API test server...");
startServer().catch((error) => {
  console.error("Server start failed:", error);
  process.exit(1);
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
