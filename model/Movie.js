const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  ageRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  producer: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true,
     min:50
  },
  actors: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }],
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
