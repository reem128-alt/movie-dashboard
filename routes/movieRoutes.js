const express = require('express');
const router = express.Router();
const multer = require('multer');
const movieController = require('../controller/movieController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure file upload fields
const uploadFields = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'actorImages', maxCount: 10 } // Handle multiple actor images
]);

// Routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovie);
router.post('/', uploadFields, movieController.createMovie);
router.put('/:id', uploadFields, movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
