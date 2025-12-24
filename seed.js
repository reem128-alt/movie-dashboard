const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./model/User');
const Movie = require('./model/Movie');

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        admin: true,
        profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        admin: false,
        profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      }
    ];

    await User.insertMany(users);
    console.log('✓ Users seeded successfully');
    console.log('  - Admin: admin@example.com / admin123');
    console.log('  - User: john@example.com / password123');
    console.log('  - User: jane@example.com / password123');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedMovies = async () => {
  try {
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Create sample movies
    const movies = [
      {
        title: 'The Shawshank Redemption',
        ageRating: 'R',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        producer: 'Frank Darabont',
        story: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. Andy Dufresne, a successful banker, is arrested for the murders of his wife and her lover, and is sentenced to life imprisonment at the Shawshank prison.',
        actors: [
          {
            name: 'Tim Robbins',
            image: 'https://m.media-amazon.com/images/M/MV5BMTI1OTYxNzAxOF5BMl5BanBnXkFtZTYwNTE5ODI4._V1_.jpg'
          },
          {
            name: 'Morgan Freeman',
            image: 'https://m.media-amazon.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_.jpg'
          }
        ],
        duration: '2h 22min',
        rating: 9.3,
        releaseYear: 1994,
        views: 15000
      },
      {
        title: 'The Godfather',
        ageRating: 'R',
        poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        producer: 'Francis Ford Coppola',
        story: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. The story spans the years from 1945 to 1955 and chronicles the Corleone family under patriarch Vito Corleone, focusing on the transformation of Michael Corleone from reluctant family outsider to ruthless mafia boss.',
        actors: [
          {
            name: 'Marlon Brando',
            image: 'https://m.media-amazon.com/images/M/MV5BMTg3MDYyMDE5OF5BMl5BanBnXkFtZTcwNjgyNTEzNA@@._V1_.jpg'
          },
          {
            name: 'Al Pacino',
            image: 'https://m.media-amazon.com/images/M/MV5BMTQzMzg1ODAyNl5BMl5BanBnXkFtZTYwMjAxODQ1._V1_.jpg'
          }
        ],
        duration: '2h 55min',
        rating: 9.2,
        releaseYear: 1972,
        views: 18000
      },
      {
        title: 'The Dark Knight',
        ageRating: 'PG-13',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        producer: 'Christopher Nolan',
        story: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the city streets.',
        actors: [
          {
            name: 'Christian Bale',
            image: 'https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_.jpg'
          },
          {
            name: 'Heath Ledger',
            image: 'https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_.jpg'
          }
        ],
        duration: '2h 32min',
        rating: 9.0,
        releaseYear: 2008,
        views: 22000
      },
      {
        title: 'Inception',
        ageRating: 'PG-13',
        poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        producer: 'Christopher Nolan',
        story: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.',
        actors: [
          {
            name: 'Leonardo DiCaprio',
            image: 'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_.jpg'
          },
          {
            name: 'Joseph Gordon-Levitt',
            image: 'https://m.media-amazon.com/images/M/MV5BMTY3NTk0NDI3Ml5BMl5BanBnXkFtZTgwNDA3NjY0MjE@._V1_.jpg'
          }
        ],
        duration: '2h 28min',
        rating: 8.8,
        releaseYear: 2010,
        views: 19500
      },
      {
        title: 'Pulp Fiction',
        ageRating: 'R',
        poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        producer: 'Quentin Tarantino',
        story: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. The film is known for its eclectic dialogue, ironic mix of humor and violence, nonlinear storyline, and a host of cinematic allusions and pop culture references.',
        actors: [
          {
            name: 'John Travolta',
            image: 'https://m.media-amazon.com/images/M/MV5BMTUwNjQ0ODkxN15BMl5BanBnXkFtZTcwMDc5NjQwNw@@._V1_.jpg'
          },
          {
            name: 'Samuel L. Jackson',
            image: 'https://m.media-amazon.com/images/M/MV5BMTQ1NTQwMTYxNl5BMl5BanBnXkFtZTYwMjA1MzY1._V1_.jpg'
          }
        ],
        duration: '2h 34min',
        rating: 8.9,
        releaseYear: 1994,
        views: 17000
      },
      {
        title: 'Forrest Gump',
        ageRating: 'PG-13',
        poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        producer: 'Robert Zemeckis',
        story: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart. Forrest Gump is a simple man with a low IQ but good intentions who witnesses and influences several defining historical events in the 20th century United States.',
        actors: [
          {
            name: 'Tom Hanks',
            image: 'https://m.media-amazon.com/images/M/MV5BMTQ2MjMwNDA3Nl5BMl5BanBnXkFtZTcwMTA2NDY3NQ@@._V1_.jpg'
          },
          {
            name: 'Robin Wright',
            image: 'https://m.media-amazon.com/images/M/MV5BMTQwMDQ4MzQxNV5BMl5BanBnXkFtZTcwMTMxMzUyMw@@._V1_.jpg'
          }
        ],
        duration: '2h 22min',
        rating: 8.8,
        releaseYear: 1994,
        views: 16500
      },
      {
        title: 'The Matrix',
        ageRating: 'R',
        poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        producer: 'Lana Wachowski, Lilly Wachowski',
        story: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. Thomas Anderson is a man living two lives: by day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination.',
        actors: [
          {
            name: 'Keanu Reeves',
            image: 'https://m.media-amazon.com/images/M/MV5BNjUxNDcwMTg4Ml5BMl5BanBnXkFtZTcwMjU4NDYyOA@@._V1_.jpg'
          },
          {
            name: 'Laurence Fishburne',
            image: 'https://m.media-amazon.com/images/M/MV5BMTc0NjczNDc1MV5BMl5BanBnXkFtZTYwMDU0Mjg1._V1_.jpg'
          }
        ],
        duration: '2h 16min',
        rating: 8.7,
        releaseYear: 1999,
        views: 20000
      },
      {
        title: 'Interstellar',
        ageRating: 'PG-13',
        poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        producer: 'Christopher Nolan',
        story: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. Earth\'s future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind\'s survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before.',
        actors: [
          {
            name: 'Matthew McConaughey',
            image: 'https://m.media-amazon.com/images/M/MV5BMTg0MDc3ODUwOV5BMl5BanBnXkFtZTcwMTk2NjY4Nw@@._V1_.jpg'
          },
          {
            name: 'Anne Hathaway',
            image: 'https://m.media-amazon.com/images/M/MV5BMTRhNzA3NGMtZmQ1Mi00ZTViLTk3ZTEtNzVhNmYwZTZhMzNjXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_.jpg'
          }
        ],
        duration: '2h 49min',
        rating: 8.6,
        releaseYear: 2014,
        views: 21000
      }
    ];

    await Movie.insertMany(movies);
    console.log('✓ Movies seeded successfully');
  } catch (error) {
    console.error('Error seeding movies:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "movies"
    });
    console.log('Connected to MongoDB');

    // Seed data
    await seedUsers();
    await seedMovies();

    console.log('\n✓ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('  Admin: admin@example.com / admin123');
    console.log('  User: john@example.com / password123');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
