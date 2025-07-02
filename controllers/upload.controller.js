const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const uploaded = req.files.map((file) => ({
      public_id: file.filename,
      secure_url: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully to Cloudinary",
      files: uploaded,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload files",
      error: error.message,
    });
  }
};

export { uploadToCloudinary };
