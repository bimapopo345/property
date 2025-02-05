import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables
process.env.MONGO_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-secret";
process.env.IMAGEKIT_PUBLIC_KEY = "test-public-key";
process.env.IMAGEKIT_PRIVATE_KEY = "test-private-key";
process.env.IMAGEKIT_URL_ENDPOINT = "https://test.imagekit.io/";

// Mock mongoose to avoid actual database connections
import mongoose from "mongoose";
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    once: jest.fn(),
    on: jest.fn(),
  },
  Schema: mongoose.Schema,
  model: mongoose.model,
  models: mongoose.models,
}));

// Mock imagekit
jest.mock("../config/imagekit.js", () => ({
  upload: jest
    .fn()
    .mockResolvedValue({ url: "https://test.imagekit.io/test-image.jpg" }),
  deleteFile: jest.fn().mockResolvedValue(true),
}));

// Mock Logger
jest.mock("../utils/logger.js", () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
  logDebug: jest.fn(),
  requestLogger: jest.fn((req, res, next) => next()),
}));
