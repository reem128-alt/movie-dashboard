const Movie = require("../model/Movie");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middleware/cloudinary");

// Helper function to handle file upload to Cloudinary
const handleFileUpload = async (file, folder) => {
  if (!file) return null;

  try {
    const imageUrl = await uploadToCloudinary(file.buffer, folder);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single movie
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const movieData = JSON.parse(req.body.movieData);

    // Handle poster upload
    if (req.files && req.files.poster) {
      const posterUrl = await handleFileUpload(
        req.files.poster[0],
        "movie-dashboard/posters"
      );
      movieData.poster = posterUrl;
    }

    // Handle actor images
    if (movieData.actors && req.files && req.files.actorImages) {
      movieData.actors = await Promise.all(
        movieData.actors.map(async (actor, index) => {
          const imageUrl = await handleFileUpload(
            req.files.actorImages[index],
            "movie-dashboard/actors"
          );
          return {
            ...actor,
            image: imageUrl,
          };
        })
      );
    }

    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const movieData = JSON.parse(req.body.movieData);

    // Handle poster upload if new poster is provided
    if (req.files && req.files.poster) {
      const posterUrl = await handleFileUpload(
        req.files.poster[0],
        "movie-dashboard/posters"
      );
      movieData.poster = posterUrl;
    }

    // Handle actor images if new images are provided
    if (movieData.actors) {
      // Get existing movie to preserve actor IDs
      const existingMovie = await Movie.findById(req.params.id);
      if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      movieData.actors = await Promise.all(
        movieData.actors.map(async (actor, index) => {
          // Get the actor image file if it exists
          const actorImageFile = req.files?.actorImages?.[index];

          // If there's a new image file, handle the upload
          const image = actorImageFile
            ? await handleFileUpload(actorImageFile, "movie-dashboard/actors")
            : actor.image;

          // Preserve the actor's ID if it exists in the database
          const existingActor = existingMovie.actors[index];
          return {
            _id: existingActor?._id, // Preserve existing ID if available
            name: actor.name,
            image: image,
          };
        })
      );
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      movieData,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Delete associated files from Cloudinary
    if (movie.poster) {
      try {
        await deleteFromCloudinary(movie.poster);
      } catch (error) {
        console.error("Error deleting poster from Cloudinary:", error);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    if (movie.actors) {
      await Promise.all(
        movie.actors.map(async (actor) => {
          if (actor.image) {
            try {
              await deleteFromCloudinary(actor.image);
            } catch (error) {
              console.error(
                "Error deleting actor image from Cloudinary:",
                error
              );
              // Continue with deletion even if Cloudinary deletion fails
            }
          }
        })
      );
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
