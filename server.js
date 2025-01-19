const express = require("express");
const config = require("config");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const fileRoute = require("./routes/file.route");
const { accessLogger, errorLogger } = require("./middleware/logger");
const swaggerDocument = require("./swagger-output.json")

const app = express();
const PORT = config.get("PORT");

// Default CORS (allow all origins)
app.use(cors());

// Database configuration
require("./utils/database");

// Middleware
app.use(express.json({ limit: "50mb" })); // Adjust as needed
app.use(express.urlencoded({ extended: true }));

app.use(errorLogger);
app.use(accessLogger);

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api", fileRoute);

// API DOCUMENTATION
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

process.on("unhandledRejection", (exc) => {
  console.error("unhandledRejection: ", exc.message);
});

process.on("uncaughtException", (exc) => {
  console.error("uncaughtException: ", exc.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
