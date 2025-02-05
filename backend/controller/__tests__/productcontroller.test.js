import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addproperty,
  listproperty,
  removeproperty,
  updateproperty,
  singleproperty,
} from "../productcontroller.js";
import Property from "../../models/propertymodel.js";
import imagekit from "../../config/imagekit.js";
import { logInfo, logError } from "../../utils/logger.js";

vi.mock("../../models/propertymodel.js");
vi.mock("../../config/imagekit.js");
vi.mock("../../utils/logger.js");
vi.mock("fs");

describe("Product Controller Tests", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      files: {},
      params: {},
    };

    mockRes = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("listproperty", () => {
    it("should return all properties successfully", async () => {
      const mockProperties = [
        { id: "1", title: "Property 1" },
        { id: "2", title: "Property 2" },
      ];

      vi.mocked(Property.find).mockResolvedValue(mockProperties);

      await listproperty(mockReq, mockRes);

      expect(Property.find).toHaveBeenCalled();
      expect(logInfo).toHaveBeenCalledWith("Properties fetched successfully", {
        count: 2,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        property: mockProperties,
        success: true,
      });
    });

    it("should handle errors when listing properties", async () => {
      const error = new Error("Database error");
      vi.mocked(Property.find).mockRejectedValue(error);

      await listproperty(mockReq, mockRes);

      expect(logError).toHaveBeenCalledWith("Error listing properties:", {
        error,
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Server Error",
        success: false,
      });
    });
  });

  describe("addproperty", () => {
    const mockPropertyData = {
      title: "Test Property",
      location: "Test Location",
      price: 100000,
      beds: 2,
      baths: 2,
      sqft: 1000,
      type: "house",
      availability: "available",
      description: "Test description",
      amenities: ["pool", "garage"],
      phone: "1234567890",
    };

    it("should add property successfully", async () => {
      mockReq.body = mockPropertyData;
      mockReq.files = {
        image1: [{ path: "test/path1", originalname: "test1.jpg" }],
      };

      const mockImageKitResponse = { url: "test-url" };
      vi.mocked(imagekit.upload).mockResolvedValue(mockImageKitResponse);

      const mockSavedProperty = { _id: "test-id", ...mockPropertyData };
      Property.prototype.save = vi.fn().mockResolvedValue(mockSavedProperty);

      await addproperty(mockReq, mockRes);

      expect(imagekit.upload).toHaveBeenCalled();
      expect(logInfo).toHaveBeenCalledWith("Property added successfully", {
        propertyId: mockSavedProperty._id,
        title: mockPropertyData.title,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Product added successfully",
        success: true,
      });
    });

    it("should handle errors when adding property", async () => {
      const error = new Error("Save error");
      Property.prototype.save = vi.fn().mockRejectedValue(error);

      mockReq.body = mockPropertyData;
      await addproperty(mockReq, mockRes);

      expect(logError).toHaveBeenCalledWith("Error adding property:", {
        error,
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Server Error",
        success: false,
      });
    });
  });

  describe("removeproperty", () => {
    it("should remove property successfully", async () => {
      const propertyId = "123";
      mockReq.body.id = propertyId;

      vi.mocked(Property.findByIdAndDelete).mockResolvedValue({
        id: propertyId,
      });

      await removeproperty(mockReq, mockRes);

      expect(Property.findByIdAndDelete).toHaveBeenCalledWith(propertyId);
      expect(logInfo).toHaveBeenCalledWith("Property removed successfully", {
        propertyId,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Property removed successfully",
        success: true,
      });
    });

    it("should handle property not found", async () => {
      mockReq.body.id = "123";
      vi.mocked(Property.findByIdAndDelete).mockResolvedValue(null);

      await removeproperty(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(logInfo).toHaveBeenCalledWith("Property not found for deletion", {
        propertyId: "123",
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Property not found",
        success: false,
      });
    });
  });

  describe("singleproperty", () => {
    it("should return a single property successfully", async () => {
      const propertyId = "123";
      const mockProperty = { id: propertyId, title: "Test Property" };

      mockReq.params.id = propertyId;
      vi.mocked(Property.findById).mockResolvedValue(mockProperty);

      await singleproperty(mockReq, mockRes);

      expect(Property.findById).toHaveBeenCalledWith(propertyId);
      expect(logInfo).toHaveBeenCalledWith(
        "Single property fetched successfully",
        { propertyId }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        property: mockProperty,
        success: true,
      });
    });

    it("should handle property not found", async () => {
      mockReq.params.id = "123";
      vi.mocked(Property.findById).mockResolvedValue(null);

      await singleproperty(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(logInfo).toHaveBeenCalledWith("Property not found", {
        propertyId: "123",
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Property not found",
        success: false,
      });
    });
  });
});
