const express = require("express");
const config = require("config");
const fileRoute = require("./routes/file.route");
const { accessLogger, errorLogger } = require("./middleware/logger");

const app = express();
const PORT = config.get("PORT");

// Database configuration
require("./utils/database");

// Middleware
app.use(express.json({ limit: "50mb" })); // Adjust as needed
app.use(express.urlencoded({ extended: true }));

app.use(errorLogger);
app.use(accessLogger);

app.use("/api", fileRoute);

process.on("unhandledRejection", (exc) => {
  console.error("unhandledRejection: ", exc.message);
  // throw exc;
});

process.on("uncaughtException", (exc) => {
  console.error("uncaughtException: ", exc.message);
  // setTimeout(() => {
  //   process.exit(1);
  // }, 1000);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
