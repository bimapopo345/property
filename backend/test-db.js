import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/propertymodel.js";

dotenv.config();

const testProperties = [
  {
    title: "Modern Apartment",
    location: "Downtown City",
    price: 750000,
    image: ["https://example.com/apartment1.jpg"],
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "apartment",
    availability: "available",
    description: "A luxurious modern apartment in the heart of the city",
    amenities: ["gym", "parking", "security"],
    phone: "1234567891",
  },
  {
    title: "Beach House",
    location: "Coastal Area",
    price: 1200000,
    image: ["https://example.com/beach1.jpg"],
    beds: 4,
    baths: 3,
    sqft: 2500,
    type: "house",
    availability: "available",
    description: "Beautiful beachfront property with amazing ocean views",
    amenities: ["pool", "beach access", "garage"],
    phone: "1234567892",
  },
  {
    title: "Mountain Cabin",
    location: "Mountain Region",
    price: 450000,
    image: ["https://example.com/cabin1.jpg"],
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "house",
    availability: "available",
    description: "Cozy mountain cabin with stunning views",
    amenities: ["fireplace", "deck", "hiking trails"],
    phone: "1234567893",
  },
];

async function addTestProperties() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Add test properties
    for (const prop of testProperties) {
      const property = new Property(prop);
      await property.save();
      console.log(`Added property: ${prop.title}`);
    }

    console.log("Test properties added successfully");
  } catch (error) {
    console.error("Error adding test properties:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

addTestProperties();
