const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const path = require("path");
const authRoute = require("./routes/authRoute");
const movieRoute = require("./routes/movieRoutes.js");

const cors = require("cors");

const cookieParser = require("cookie-parser");

// Cloudinary configuration
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
dbConnect();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://movie-dash-front.vercel.app"],
    credentials: true,
  })
);

// Serve static files from uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Commented out since using Cloudinary
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/movies", movieRoute);

app.listen(3000, () => {
  console.log("server is running");
});
