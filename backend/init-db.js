import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/propertymodel.js";

// Load environment variables
dotenv.config();

console.log("Starting database initialization...");
console.log("MongoDB URI:", process.env.MONGO_URI);

async function initializeDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Successfully connected to MongoDB");

    // Create collections if they don't exist
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log("Existing collections:", collectionNames);

    if (!collectionNames.includes("properties")) {
      console.log("Creating properties collection...");

      // Create a sample property
      const sampleProperty = new Property({
        title: "Sample Property",
        location: "Sample Location",
        price: 500000,
        image: ["https://example.com/sample.jpg"],
        beds: 3,
        baths: 2,
        sqft: 1500,
        type: "house",
        availability: "available",
        description: "A beautiful sample property",
        amenities: ["garden", "garage", "pool"],
        phone: "1234567890",
      });

      await sampleProperty.save();
      console.log("Created sample property with ID:", sampleProperty._id);
    } else {
      console.log("Properties collection already exists");
      const count = await Property.countDocuments();
      console.log("Number of properties:", count);
    }

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Run initialization
initializeDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
