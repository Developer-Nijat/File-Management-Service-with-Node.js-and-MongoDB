const fs = require("fs");
const path = require("path");

// Helper function to create directories
const createDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

module.exports = {
  createDir,
};
