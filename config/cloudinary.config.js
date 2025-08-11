import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  CLOUDINARYname: process.env.CLOUDINARY_CLOUDINARYNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: "uploads",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "csv", "xlsx", "xls"],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: isImage ? "image" : "raw",
    };
  },
});

export { cloudinary, storage };
