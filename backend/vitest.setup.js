import { beforeAll, afterAll, vi } from "vitest";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables
process.env.MONGO_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-secret";
process.env.IMAGEKIT_PUBLIC_KEY = "test-public-key";
process.env.IMAGEKIT_PRIVATE_KEY = "test-private-key";
process.env.IMAGEKIT_URL_ENDPOINT = "https://test.imagekit.io/";

// Mock mongoose
vi.mock("mongoose", () => ({
  connect: vi.fn().mockResolvedValue(true),
  connection: {
    once: vi.fn(),
    on: vi.fn(),
  },
  Schema: class {},
  model: vi.fn().mockReturnValue({
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
  }),
}));

// Mock imagekit
vi.mock("./config/imagekit.js", () => ({
  default: {
    upload: vi
      .fn()
      .mockResolvedValue({ url: "https://test.imagekit.io/test-image.jpg" }),
    deleteFile: vi.fn().mockResolvedValue(true),
  },
}));

// Mock Logger
vi.mock("./utils/logger.js", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
  logWarn: vi.fn(),
  logDebug: vi.fn(),
  requestLogger: vi.fn((req, res, next) => next()),
}));

// Mock fs
vi.mock("fs", () => ({
  readFileSync: vi.fn(),
  unlink: vi.fn((path, callback) => callback()),
}));

beforeAll(() => {
  // Any setup before all tests
});

afterAll(() => {
  // Any cleanup after all tests
  vi.clearAllMocks();
});
