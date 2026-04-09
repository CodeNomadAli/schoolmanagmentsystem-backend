import { apiResponse } from "../helper.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload image from a local file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The buffer of the uploaded file (from multer)
 * @returns {Promise<object>} apiResponse object with upload result
 */
export const uploadImageFromBuffer = async (fileBuffer) => {
  if (!fileBuffer) return apiResponse(400, "File buffer is required");

  try {
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

      // Pipe the file buffer to Cloudinary
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    return {
      type: uploadResult.format,
      source: uploadResult.secure_url,
      originalName: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return apiResponse(500, `Failed to upload image: ${error.message}`);
  }
};