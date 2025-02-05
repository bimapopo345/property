import dotenv from "dotenv";
import mongoose from "mongoose";
import { logInfo, logError } from "./utils/logger.js";
import Property from "./models/propertymodel.js";

// Load environment variables
dotenv.config();

console.log("Starting manual test...");
console.log("MongoDB URI:", process.env.MONGO_URI);

// Test database operations
async function testDatabaseOperations() {
  try {
    console.log("Attempting to connect to MongoDB...");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected successfully");

    // Test listing properties
    console.log("Fetching properties...");
    let properties = await Property.find();

    console.log("Properties found:", properties.length);

    if (properties.length === 0) {
      console.log("No properties found. Creating a test property...");

      const testProperty = new Property({
        title: "Test Property",
        location: "Test Location",
        price: 100000,
        image: ["https://example.com/test.jpg"],
        beds: 2,
        baths: 2,
        sqft: 1000,
        type: "house",
        availability: "available",
        description: "Test description",
        amenities: ["parking", "garden"],
        phone: "1234567890",
      });

      await testProperty.save();
      console.log("Test property created successfully");

      // Fetch properties again
      properties = await Property.find();
      console.log("Updated properties count:", properties.length);
    }

    if (properties.length > 0) {
      console.log("Sample property:", JSON.stringify(properties[0], null, 2));
    }

    // Log success
    logInfo("Test completed successfully", {
      propertiesCount: properties.length,
    });
  } catch (error) {
    console.error("Error during test:", error.message);
    console.error("Full error:", error);
    logError("Test failed", { error });
    throw error;
  } finally {
    try {
      console.log("Closing database connection...");
      await mongoose.connection.close();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database connection:", err);
    }
    process.exit(0);
  }
}

// Start the test
console.log("Running database test...");
testDatabaseOperations().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});

// Handle process termination
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  mongoose.connection.close().then(() => process.exit(1));
});
