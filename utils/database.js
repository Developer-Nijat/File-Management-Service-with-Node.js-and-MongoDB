const mongoose = require("mongoose");
const config = require("config");

// MongoDB connection
mongoose
  .connect(config.get("MONGODB_URI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Mongoose connection failed: ", err));

mongoose.Promise = global.Promise;
