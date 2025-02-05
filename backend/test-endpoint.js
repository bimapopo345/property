import { listproperty } from "./controller/productcontroller.js";
import { logInfo } from "./utils/logger.js";

// Mock request and response
const req = {};
const res = {
  json: (data) => {
    console.log("Response:", data);
    return res;
  },
  status: (code) => {
    console.log("Status:", code);
    return res;
  },
};

console.log("Testing list properties endpoint...");
listproperty(req, res)
  .then(() => {
    logInfo("Test completed successfully");
  })
  .catch((err) => {
    console.error("Test failed:", err);
  });
