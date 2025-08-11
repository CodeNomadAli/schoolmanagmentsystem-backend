import { apiResponse } from "../helper.js";
import { v2 as cloudinary } from "cloudinary";
import { pipeline } from "stream/promises"; // Import pipeline
import slugify from "./slugify.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload image from external URL to Cloudinary
 * @param {string} fileUrl - The URL of the image to upload
 * @returns {Promise<object>} apiResponse object with upload result
 */
export const uploadImageFromUrl = async (fileUrl) => {
  if (!fileUrl) return apiResponse(400, "Image URL is required");

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    // Create a promise to handle Cloudinary upload result
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "remedy_uploads" },
        (error, result) => {
          if (error) {
            console.error("Upload failed:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      // Pipe fetch response to Cloudinary upload stream
      pipeline(response.body, uploadStream).catch(reject);
    });


    return {
      type:uploadResult.format,
      source: uploadResult.secure_url,
      originalName: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return apiResponse(500, `Failed to upload image: ${error.message}`);
  }
};

