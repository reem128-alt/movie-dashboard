const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const path = require("path");
const authRoute = require("./routes/authRoute");
const movieRoute = require("./routes/movieRoutes.js");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const app = express();
dbConnect();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/movies", movieRoute);

app.listen(3000, () => {
  console.log("server is running");
});
