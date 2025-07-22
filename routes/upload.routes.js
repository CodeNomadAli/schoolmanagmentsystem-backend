import express from "express";
import multer from "multer";
import { uploadFile ,deleteFile,getFile } from "../controllers/portal/file.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log("File received:",req, file.originalname, file.mimetype);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

console.log("File upload route initialized");
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/delete/:path", deleteFile);
router.get("/:path", getFile);



router.use((err, req, res, next) => {
  console.error("Error in file upload middleware:", err);
  if (err instanceof multer.MulterError || err.message === "Unsupported file type") {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

export default router;
