const movieSchema = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const { invalidMovieId, invalidMovieData, accessDenied, invalidMovieDelete} = require('../utils/errorMessages');

const getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(invalidMovieData),
        );
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  movieSchema.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(invalidMovieId);
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        movieSchema.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError(accessDenied);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(invalidMovieDelete));
      } else {
        next(err);
      }
    });
};

module.exports = {
  deleteMovie,
  createMovie,
  getMovies,
};