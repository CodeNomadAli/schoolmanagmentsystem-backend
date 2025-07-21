import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import crypto from "crypto";

const router = express.Router();

const spacesEndpoint = new AWS.Endpoint("tor1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO801XJVR7VHHZQ86AND",
  secretAccessKey: "S8AZbv/4O2bl4/iATO8lxyrfK1Yvhm3RpCmqmsiWV14",
  region: "us-east-1",
  signatureVersion: "v4",
});

const BUCKET_NAME = "remedy-bucket";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
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

router.post("/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const file = req.file;
    const ext = file.originalname.split(".").pop();
    const uniqueName = `uploads/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueName,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    res.status(200).json({
      success: true,
      message: "File uploaded successfully to DigitalOcean Spaces",
      file: {
        key: data.Key,
        url: data.Location,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
