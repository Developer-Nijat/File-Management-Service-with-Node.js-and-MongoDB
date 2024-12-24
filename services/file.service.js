const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("config");
const { createDir } = require("../utils/common");
const File = require("../models/File");

// Config
const allowedFormats = config.get("ALLOWED_FILE_FORMATS");
const maxFileSize = config.get("MAX_FILE_SIZE"); // 5 * 1024 * 1024; // 5 MB

const singleBase64FileUpload = async (req, res) => {
  try {
    const { base64Content, fileName, fileType, folder } = req.body;

    if (!allowedFormats.includes(fileType)) {
      return res.status(400).send("Invalid file format.");
    }

    const fileBuffer = Buffer.from(base64Content, "base64");
    if (fileBuffer.length > maxFileSize) {
      return res.status(400).send("File size exceeds the limit.");
    }

    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const dirPath = path.join(
      process.cwd(),
      "uploads",
      folder,
      year.toString(),
      month
    );

    fs.mkdirSync(dirPath, { recursive: true });

    const fileId = uuidv4();
    const filePath = path.join(dirPath, `${fileId}-${fileName}`);

    fs.writeFileSync(filePath, fileBuffer);

    const file = new File({
      fileId,
      fileName,
      fileType,
      fileSize: fileBuffer.length,
      filePath,
      folder,
    });

    await file.save();
    res.status(201).send({ message: "File uploaded successfully.", fileId });
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
};

const multipleBase64FileUpload = async (req, res) => {
  try {
    const { files } = req.body; // Array of { base64Content, fileName, fileType, folder }

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).send("No files provided.");
    }

    const results = [];

    for (const fileData of files) {
      const { base64Content, fileName, fileType, folder } = fileData;

      if (!allowedFormats.includes(fileType)) {
        results.push({ fileName, status: "Invalid file format" });
        continue;
      }

      const fileBuffer = Buffer.from(base64Content, "base64");
      if (fileBuffer.length > maxFileSize) {
        results.push({ fileName, status: "File size exceeds the limit" });
        continue;
      }

      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
      const dirPath = path.join(
        process.cwd(),
        "uploads",
        folder,
        year.toString(),
        month
      );

      createDir(dirPath);

      const fileId = uuidv4();
      const filePath = path.join(dirPath, `${fileId}-${fileName}`);

      fs.writeFileSync(filePath, fileBuffer);

      const file = new File({
        fileId,
        fileName,
        fileType,
        fileSize: fileBuffer.length,
        filePath,
        folder,
      });

      await file.save();
      results.push({ fileId, fileName, status: "Uploaded successfully" });
    }

    res.status(201).send(results);
  } catch (error) {
    res.status(500).send("Error uploading files.");
  }
};

const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({ fileId });

    if (!file) {
      return res.status(404).send("File not found.");
    }

    const fileBuffer = fs.readFileSync(file.filePath);
    res.send({
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      content: fileBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(500).send("Error reading file.");
  }
};

const deleteFileById = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findOneAndDelete({ fileId });

    if (!file) {
      return res.status(404).send("File not found.");
    }

    fs.unlinkSync(file.filePath);
    res.send({ message: "File deleted successfully." });
  } catch (error) {
    res.status(500).send("Error deleting file.");
  }
};

const deleteMultipleFiles = async (req, res) => {
  try {
    const { fileIds } = req.body; // Array of file IDs

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).send("No file IDs provided.");
    }

    const files = await File.find({ fileId: { $in: fileIds } });

    if (files.length === 0) {
      return res.status(404).send("Files not found.");
    }

    for (const file of files) {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
    }

    await File.deleteMany({ fileId: { $in: fileIds } });

    res.send({
      message: "Files deleted successfully.",
      deletedCount: files.length,
    });
  } catch (error) {
    res.status(500).send("Error deleting files.");
  }
};

const getFiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      folder,
      fileName,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (folder) query.folder = folder;
    if (fileName) query.fileName = { $regex: fileName, $options: "i" };
    if (startDate && endDate) {
      query.uploadDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const files = await File.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ uploadDate: -1 });

    const totalFiles = await File.countDocuments(query);

    res.send({
      total: totalFiles,
      page,
      limit,
      files,
    });
  } catch (error) {
    res.status(500).send("Error fetching files.");
  }
};

const singleFileUpload = async (req, res) => {
  try {
    const { folder } = req.body;
    const folderFromHeaders = req?.headers?.["folder"];
    const folderName = folder || folderFromHeaders;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file provided.");
    }

    const fileData = new File({
      fileId: uuidv4(),
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      folder: folderName || "default",
    });

    await fileData.save();
    res.status(201).send({
      message: "File uploaded successfully.",
      fileId: fileData.fileId,
    });
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
};

const multipleFileUpload = async (req, res) => {
  try {
    const { folder } = req.body;
    const folderFromHeaders = req?.headers?.["folder"];
    const folderName = folder || folderFromHeaders;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("No files provided.");
    }

    const results = [];

    for (const file of files) {
      const fileData = new File({
        fileId: uuidv4(),
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        folder: folderName || "default",
      });

      await fileData.save();
      results.push({
        fileName: file.originalname,
        fileId: fileData.fileId,
        status: "Uploaded successfully",
      });
    }

    res.status(201).send(results);
  } catch (error) {
    res.status(500).send("Error uploading files.");
  }
};

module.exports = {
  getFileById,
  deleteFileById,
  deleteMultipleFiles,
  singleBase64FileUpload,
  multipleBase64FileUpload,
  getFiles,
  singleFileUpload,
  multipleFileUpload,
};
