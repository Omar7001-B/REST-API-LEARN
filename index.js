require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Construct the connection string
// Required .env variables: DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_NAME, DB_OPTIONS
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}${process.env.DB_OPTIONS}`;

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());

const subscribersRouter = require("./routes/subscriberRoute");
app.use("/subscribers", subscribersRouter);

app.listen(3000, () => console.log("Server is running on port 3000"));
