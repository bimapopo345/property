import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

let imagekit = null;

try {
  if (
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log("ImageKit connected successfully!");
  } else {
    console.log(
      "ImageKit configuration not found - running without image upload functionality"
    );
  }
} catch (error) {
  console.warn("ImageKit initialization failed:", error.message);
}

export default imagekit;
