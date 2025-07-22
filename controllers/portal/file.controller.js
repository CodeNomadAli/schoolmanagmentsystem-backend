import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import crypto from "crypto";

import s3 from "../../utils/s3.config.js";

const BUCKET = process.env.DO_SPACES_BUCKET;

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const file = req.file;
    const ext = file.originalname.split(".").pop();
    const key = `uploads/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    await s3.send(command);

    const fileUrl = `https://${BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        key,
        url: fileUrl,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getFile = async (req, res) => {
  const { key } = req.params;

  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));

    const fileUrl = `https://${BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;

    res.status(200).json({ success: true, url: fileUrl });
  } catch (err) {
    res.status(404).json({ success: false, message: "File not found" });
  }
};

export const deleteFile = async (req, res) => {
  const { key } = req.params;

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
