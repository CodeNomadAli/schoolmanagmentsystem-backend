import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../controllers/upload.controller.js";
import {storage} from "./../config/cloudinary.config.js"

const uploadRouter = express.Router();

// Configure multer
const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/webp", "image/jpg",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/csv"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  }
});

// Route to upload multiple files
uploadRouter.post("/multiple", 
  (req, res, next) => {
    upload.array("files", 10)(req, res, (err) => {
      console.log(req.body)
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  uploadToCloudinary
);

// General error handler
uploadRouter.use((error, req, res, next) => {
  console.error('Upload error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'An error occurred during file upload',
    error: error.name || 'UPLOAD_ERROR'
  });
});

export default uploadRouter;
