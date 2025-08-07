import { apiResponse } from "../helper.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "./slugify.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

/**
 * Upload image from external URL to Cloudinary
 * @param {string} imageUrl
 * @returns {Promise<object>} apiResponse object
 */
export const uploadImageFromUrl = async (imageUrl) => {
  if (!imageUrl) return apiResponse(400, "Image URL is required");

  try {
    const fileName = imageUrl.split("/").pop().split(".")[0];
    const publicId = slugify(fileName, { lower: true });

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "remedies",
      public_id: publicId,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
 console.log(result)
    return apiResponse(200, "Image uploaded successfully", {
      source: result.secure_url,
      type: result.format,
      originalName: result.original_filename,
    });
  } catch (error) {
    return apiResponse(500, `Cloudinary upload failed: ${error.message}`);
  }
};


// const test = async () => {
//   const res = await uploadImageFromUrl("https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg");
//   console.log(res);
// };

// test();
