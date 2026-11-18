
const express = require("express");
const crypto = require("crypto");
const path = require("path");

const {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const mongoose = require("mongoose");
const File = require("../models/File");
const s3 = require("../config/s3");

const router = express.Router();

const BUCKET = process.env.S3_BUCKET;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// 1. Generate temporary upload URL
router.post("/upload-url", async (req, res) => {
  try {
    const { fileName, contentType, size } = req.body;

    if (!fileName || !Number.isFinite(size) || size <= 0) {
      return res.status(400).json({
        message: "Valid file name and size are required"
      });
    }

    if (size > MAX_FILE_SIZE) {
      return res.status(400).json({
        message: "Maximum file size is 10 MB"
      });
    }

    const safeName = path.basename(fileName).replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const key = `uploads/${crypto.randomUUID()}-${safeName}`;
    const type = contentType || "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: type
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    res.json({
      uploadUrl,
      key,
      fileName: safeName,
      contentType: type
    });

  } catch (error) {
    console.error("Upload URL error:", error);
    res.status(500).json({
      message: "Could not generate upload URL"
    });
  }
});


// 2. Verify uploaded file and save metadata in MongoDB
router.post("/confirm", async (req, res) => {
  try {
    const { key, fileName, contentType, size } = req.body;

    if (
      typeof key !== "string" ||
      !key.startsWith("uploads/") ||
      key.includes("..") ||
      !fileName ||
      !Number.isFinite(size) ||
      size <= 0 ||
      size > MAX_FILE_SIZE
    ) {
      return res.status(400).json({
        message: "Invalid file information"
      });
    }

    const head = await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key
      })
    );

    if (
      head.ContentLength !== size ||
      head.ContentType !== contentType
    ) {
      return res.status(400).json({
        message: "Uploaded file details do not match"
      });
    }

    const savedFile = await File.create({
      originalName: fileName,
      s3Key: key,
      bucketName: BUCKET,
      contentType: head.ContentType,
      size: head.ContentLength
    });

    res.status(201).json({
      message: "File uploaded and saved successfully",
      file: savedFile
    });

  } catch (error) {
    console.error("File confirmation error:", error);
    res.status(500).json({
      message: "Could not save file information"
    });
  }
});


// 3. List uploaded files
router.get("/", async (req, res) => {
  try {
    const files = await File.find()
      .sort({ uploadedAt: -1 });

    res.json(files);

  } catch (error) {
    console.error("List files error:", error);
    res.status(500).json({
      message: "Could not fetch files"
    });
  }
});


// 4. Generate temporary download URL
router.get("/:id/download-url", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid file ID"
      });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const command = new GetObjectCommand({
      Bucket: file.bucketName,
      Key: file.s3Key,
      ResponseContentDisposition: "attachment"
    });

    const downloadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    res.json({ downloadUrl });

  } catch (error) {
    console.error("Download URL error:", error);
    res.status(500).json({
      message: "Could not generate download URL"
    });
  }
});

module.exports = router;
