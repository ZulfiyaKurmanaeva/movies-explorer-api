const movieRoutes = require('express')
  .Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../utils/validations');

movieRoutes.get('/movies', getMovies);
movieRoutes.post('/movies', validateCreateMovie, createMovie);
movieRoutes.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRoutes;