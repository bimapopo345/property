import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import Property from "../../models/propertymodel.js";
import { listproperty } from "../productcontroller.js";
import { logInfo, logError } from "../../utils/logger.js";

// Mock entire modules
vi.mock("../../models/propertymodel.js");
vi.mock("../../utils/logger.js");
vi.mock("mongoose");

describe("Property Controller Tests", () => {
  let req;
  let res;

  // Set up our mocks before each test
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    console.log("Setting up test mocks...");

    // Mock request and response
    req = {};
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    // Mock Property.find
    Property.find = vi.fn();

    // Mock logger functions
    vi.mocked(logInfo).mockImplementation((...args) => {
      console.log("Logged Info:", ...args);
    });
    vi.mocked(logError).mockImplementation((...args) => {
      console.log("Logged Error:", ...args);
    });
  });

  it("lists properties successfully", async () => {
    console.log("Running successful list properties test...");

    // Arrange
    const mockProperties = [
      { id: 1, name: "Property 1" },
      { id: 2, name: "Property 2" },
    ];

    Property.find.mockResolvedValue(mockProperties);

    // Act
    await listproperty(req, res);

    // Assert
    console.log("Checking assertions...");
    expect(Property.find).toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      property: mockProperties,
      success: true,
    });

    console.log("Test completed successfully");
  });

  it("handles errors when listing properties fails", async () => {
    console.log("Running error handling test...");

    // Arrange
    const error = new Error("Database error");
    Property.find.mockRejectedValue(error);

    // Act
    await listproperty(req, res);

    // Assert
    console.log("Checking error handling assertions...");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(logError).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Server Error",
      success: false,
    });

    console.log("Error handling test completed");
  });
});
