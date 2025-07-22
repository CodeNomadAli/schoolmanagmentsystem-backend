import express from "express";
import multer from "multer";
// 

const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "image/jpg",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "text/csv",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Unsupported file type"), false);
//     }
//   },
// });

// router.post("/upload", upload.single("file"), uploadFile);


// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError || err.message === "Unsupported file type") {
//     return res.status(400).json({ success: false, message: err.message });
//   }
//   next(err);
// });

export default router;
