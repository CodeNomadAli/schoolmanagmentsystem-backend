import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../utils/s3.config.js";
import crypto from "crypto";
import { apiResponse } from "../../helper.js";

const BUCKET = process.env.DO_SPACES_BUCKET;
const ENDPOINT = process.env.DO_SPACES_ENDPOINT;

export const uploadFile = async (req, res) => {
  try {
    console.log("File upload request received:", req.file);
    if (!req.file) {
      return res.status(400).json(apiResponse(400, null, "No file uploaded"));
    }

    const ext = req.file.originalname.split(".").pop();
    const path = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: path,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    });

    await s3.send(command);

    const url = `https://${BUCKET}.${ENDPOINT}/${path}`;
     
    

    return res.status(200).json(apiResponse(200, {
      path,
      url,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    }, "File uploaded successfully"));
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json(apiResponse(500, null, error.message || "Internal Server Error"));
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { path } = req.params;
    console.log("File delete request received:", path);
    if (!path) {
      return res.status(400).json(apiResponse(400, null, "File path is required"));
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: path,
    });

    await s3.send(command);

    return res.status(200).json(apiResponse(200, null, "File deleted successfully"));
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json(apiResponse(500, null, error.message || "Internal Server Error"));
  }
};

export const getFile = async (req, res) => {
  try {
    const { path } = req.params;
    if (!path) {
      return res.status(400).json(apiResponse(400, null, "File path is required"));
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: path,
    });

    const data = await s3.send(command);

    res.setHeader("Content-Type", data.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${path}"`);
    data.Body.pipe(res);
  } catch (error) {
    console.error("Get file error:", error);
    return res.status(500).json(apiResponse(500, null, error.message || "Internal Server Error"));
  }
};
