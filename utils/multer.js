const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("config");
const { v4: uuidv4 } = require("uuid");

// Config
const allowedFormats = config.get("ALLOWED_FILE_FORMATS");
const maxFileSize = config.get("MAX_FILE_SIZE"); // 5 * 1024 * 1024; // 5 MB

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { folder } = req.body;
    const folderFromHeaders = req?.headers?.["folder"];
    const folderName = folder || folderFromHeaders;

    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const dirPath = path.join(
      process.cwd(),
      "uploads",
      folderName || "default",
      year.toString(),
      month
    );

    fs.mkdirSync(dirPath, { recursive: true });
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    cb(null, `${fileId}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter: (req, file, cb) => {
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format."));
    }
  },
});

module.exports = upload;
