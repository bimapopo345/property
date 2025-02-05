import { logInfo, logError } from "./utils/logger.js";

// Test info logging
logInfo("Test logging system", {
  environment: process.env.NODE_ENV || "development",
  timestamp: new Date().toISOString(),
});

// Test error logging
logError("Test error logging", {
  testId: "TEST-001",
  type: "verification",
  timestamp: new Date().toISOString(),
});

console.log(
  "Logging test complete - check logs/combined.log and logs/error.log"
);
