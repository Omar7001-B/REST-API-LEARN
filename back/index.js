require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Construct the connection string
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}${process.env.DB_OPTIONS}`;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Try setting this to a higher value
    socketTimeoutMS: 45000, // Higher socket timeout
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Connection error:", error));

const db = mongoose.connection;

db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());
app.use(cors());

const subscribersRouter = require("./routes/subscriberRoute");
app.use("/subscribers", subscribersRouter);

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
