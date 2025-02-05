import fs from "fs";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";
import { logError, logInfo } from "../utils/logger.js";

const addproperty = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    logInfo("Uploading images to ImageKit", { imageCount: images.length });

    // Upload images to ImageKit and delete after upload
    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await imagekit.upload({
          file: fs.readFileSync(item.path),
          fileName: item.originalname,
          folder: "Property",
        });
        fs.unlink(item.path, (err) => {
          if (err)
            logError("Error deleting temp file:", {
              error: err,
              path: item.path,
            });
        });
        return result.url;
      })
    );

    // Create a new product
    const product = new Property({
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      image: imageUrls,
      phone,
    });

    // Save the product to the database
    await product.save();
    logInfo("Property added successfully", { propertyId: product._id, title });
    res.json({ message: "Product added successfully", success: true });
  } catch (error) {
    logError("Error adding property:", { error });
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const listproperty = async (req, res) => {
  try {
    const property = await Property.find();
    logInfo("Properties fetched successfully", { count: property.length });
    res.json({ property, success: true });
  } catch (error) {
    logError("Error listing properties:", { error });
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const removeproperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.body.id);
    if (!property) {
      logInfo("Property not found for deletion", { propertyId: req.body.id });
      return res
        .status(404)
        .json({ message: "Property not found", success: false });
    }
    logInfo("Property removed successfully", { propertyId: req.body.id });
    return res.json({
      message: "Property removed successfully",
      success: true,
    });
  } catch (error) {
    logError("Error removing property:", { error, propertyId: req.body.id });
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const updateproperty = async (req, res) => {
  try {
    const {
      id,
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      type,
      availability,
      description,
      amenities,
      phone,
    } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      logInfo("Property not found for update", { propertyId: id });
      return res
        .status(404)
        .json({ message: "Property not found", success: false });
    }

    if (!req.files) {
      // No new images provided
      property.title = title;
      property.location = location;
      property.price = price;
      property.beds = beds;
      property.baths = baths;
      property.sqft = sqft;
      property.type = type;
      property.availability = availability;
      property.description = description;
      property.amenities = amenities;
      property.phone = phone;

      await property.save();
      logInfo("Property updated successfully (no new images)", {
        propertyId: id,
      });
      return res.json({
        message: "Property updated successfully",
        success: true,
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    logInfo("Uploading new images for property update", {
      propertyId: id,
      imageCount: images.length,
    });

    // Upload images to ImageKit and delete after upload
    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await imagekit.upload({
          file: fs.readFileSync(item.path),
          fileName: item.originalname,
          folder: "Property",
        });
        fs.unlink(item.path, (err) => {
          if (err)
            logError("Error deleting temp file:", {
              error: err,
              path: item.path,
            });
        });
        return result.url;
      })
    );

    property.title = title;
    property.location = location;
    property.price = price;
    property.beds = beds;
    property.baths = baths;
    property.sqft = sqft;
    property.type = type;
    property.availability = availability;
    property.description = description;
    property.amenities = amenities;
    property.image = imageUrls;
    property.phone = phone;

    await property.save();
    logInfo("Property updated successfully with new images", {
      propertyId: id,
      imageCount: imageUrls.length,
    });
    res.json({ message: "Property updated successfully", success: true });
  } catch (error) {
    logError("Error updating property:", { error, propertyId: req.body.id });
    res.status(500).json({ message: "Server Error", success: false });
  }
};

const singleproperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      logInfo("Property not found", { propertyId: id });
      return res
        .status(404)
        .json({ message: "Property not found", success: false });
    }
    logInfo("Single property fetched successfully", { propertyId: id });
    res.json({ property, success: true });
  } catch (error) {
    logError("Error fetching single property:", {
      error,
      propertyId: req.params.id,
    });
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export {
  addproperty,
  listproperty,
  removeproperty,
  updateproperty,
  singleproperty,
};
