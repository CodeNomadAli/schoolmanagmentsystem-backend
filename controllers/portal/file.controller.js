import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../utils/s3.config.js";
import crypto from "crypto";

const BUCKET = process.env.DO_SPACES_BUCKET;

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop();
    const key = `uploads/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    });

    await s3.send(command);

    const url = `https://${BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        key,
        url,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};
