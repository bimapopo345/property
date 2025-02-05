import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function testRequest() {
  try {
    console.log("Testing API endpoint...");
    const response = await fetch("http://localhost:4000/api/products/list");
    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Data received:", JSON.stringify(data, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

// Start the test
console.log("Starting test...");
testRequest();
