
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true,
    unique: true
  },
  bucketName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    default: "application/octet-stream"
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);
