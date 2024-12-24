const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileId: { type: String, unique: true },
  fileName: String,
  fileType: String,
  fileSize: Number,
  filePath: String,
  folder: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
