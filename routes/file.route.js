const express = require("express");
const {
  singleBase64FileUpload,
  getFileById,
  deleteFileById,
  multipleBase64FileUpload,
  getFiles,
  deleteMultipleFiles,
  singleFileUpload,
  multipleFileUpload,
} = require("../services/file.service");
const upload = require("../utils/multer");
const auth = require("../middleware/auth");

const router = express.Router();

// Upload single base64 file
router.post("/file/upload-single-base64", singleBase64FileUpload);

// Upload multiple base64 files
router.post("/file/upload-multiple-base64", multipleBase64FileUpload);

// Upload single file object
router.post(
  "/file/upload-single",
  // auth,
  upload.single("file"),
  singleFileUpload
);

// Upload multiple file objects
router.post(
  "/file/upload-multiple",
  // auth,
  upload.array("files", 10),
  multipleFileUpload
);

// File List and Search API
router.get("/file/list", getFiles);

// Read single file
router.get("/file/:fileId", getFileById);

// Delete single file
router.delete("/file/:fileId", auth, deleteFileById);

// Delete multiple files
router.delete("/file/delete-multiple", auth, deleteMultipleFiles);

module.exports = router;
