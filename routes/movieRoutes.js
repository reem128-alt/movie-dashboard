const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");
const { upload } = require("../middleware/cloudinary");

// Configure file upload fields
const uploadFields = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "actorImages", maxCount: 10 }, // Handle multiple actor images
]);

// Routes
router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovie);
router.post("/", uploadFields, movieController.createMovie);
router.put("/:id", uploadFields, movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
