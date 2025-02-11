const Movie = require('../model/Movie');
const fs = require('fs');
const path = require('path');

// Helper function to handle file upload
const handleFileUpload = (file, directory) => {
  if (!file) return null;
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = uniqueSuffix + path.extname(file.originalname);
  const filepath = path.join(__dirname, '..', 'uploads', filename);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/${filename}`; // Return URL path instead of filename
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
      return res.status(404).json({ message: 'Movie not found' });
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
      const posterFilename = handleFileUpload(req.files.poster[0], 'uploads/posters');
      movieData.poster = posterFilename;
    }

    // Handle actor images
    if (movieData.actors && req.files && req.files.actorImages) {
      movieData.actors = movieData.actors.map((actor, index) => ({
        ...actor,
        image: handleFileUpload(req.files.actorImages[index], 'uploads/actors')
      }));
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
      const posterFilename = handleFileUpload(req.files.poster[0], 'uploads/posters');
      movieData.poster = posterFilename;
    }

    // Handle actor images if new images are provided
    if (movieData.actors) {
      // Get existing movie to preserve actor IDs
      const existingMovie = await Movie.findById(req.params.id);
      if (!existingMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      movieData.actors = movieData.actors.map((actor, index) => {
        // Get the actor image file if it exists
        const actorImageFile = req.files?.actorImages?.[index];
        
        // If there's a new image file, handle the upload
        const image = actorImageFile 
          ? handleFileUpload(actorImageFile, 'uploads/actors')
          : actor.image;

        // Preserve the actor's ID if it exists in the database
        const existingActor = existingMovie.actors[index];
        return {
          _id: existingActor?._id, // Preserve existing ID if available
          name: actor.name,
          image: image
        };
      });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      movieData,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
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
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Delete associated files
    if (movie.poster) {
      const posterPath = path.join(__dirname, '..', 'uploads', movie.poster.replace('/uploads/', ''));
      if (fs.existsSync(posterPath)) {
        fs.unlinkSync(posterPath);
      }
    }

    if (movie.actors) {
      movie.actors.forEach(actor => {
        if (actor.image) {
          const actorImagePath = path.join(__dirname, '..', 'uploads', actor.image.replace('/uploads/', ''));
          if (fs.existsSync(actorImagePath)) {
            fs.unlinkSync(actorImagePath);
          }
        }
      });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
