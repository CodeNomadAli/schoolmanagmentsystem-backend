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

  console.log(fileUrl, "img");
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

    return apiResponse(200, "Image uploaded successfully", {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return apiResponse(500, `Failed to upload image: ${error.message}`);
  }
};

// const test = async () => {
//   const imageUrl =
//     "https://oaidalleapiprodscus.blob.core.windows.net/private/org-dHpFR1jO8nBkdylStZ751cde/user-AC7culwx7r9njBdvhM2jtZVg/img-dluPTViuOJ6i9REmTc0bHWGx.png?st=2025-08-08T15%3A15%3A24Z&se=2025-08-08T17%3A15%3A24Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=b2c0e1c0-cf97-4e19-8986-8073905d5723&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-08T13%3A11%3A18Z&ske=2025-08-09T13%3A11%3A18Z&sks=b&skv=2024-08-04&sig=YWKs/ds9lqI0mCKnvdkJDmbtIKpuD1j%2Bu8YwG5TDWZg%3D";

//   const res = await uploadImageFromUrl(imageUrl);
//   console.log(res);
// };

// // Uncomment to run the test
// test();