require("dotenv").config();

const DEBUG = false;
const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Check for required environment variables
if (
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_CLUSTER ||
  !process.env.DB_NAME
) {
  console.error(
    "Missing required environment variables for database connection."
  );
  process.exit(1);
}

// Construct the connection string
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}${process.env.DB_OPTIONS}`;

//log(connectionString);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Try setting this to a higher value
    socketTimeoutMS: 45000, // Higher socket timeout
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => {
    console.error("Connection error:", error);
    process.exit(1); // Exit process if database connection fails
  });

const db = mongoose.connection;

db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Database connection opened"));

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  log(req.method, req.path, req.body);
  next();
});

const subscribersRouter = require("./routes/subscriberRoute");
const modInfoRouter = require("./routes/modInfoRoute");
const statsRouter = require("./routes/statsRoute");
const modRouter = require("./routes/modRoute");
const logRouter = require("./routes/logRoutes");

app.use("/subscribers", subscribersRouter);
app.use("/modInfo", modInfoRouter);
app.use("/stats", statsRouter);
app.use("/mod", modRouter);
app.use("/log", logRouter);

app.all("*", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  res.status(404).json({
    message: "The endpoint you are trying to reach does not exist.",
    ip: ip,
  });
});

// Remove this line when deploying to Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running on port " + PORT));

module.exports = app; // Export the app for Vercel
