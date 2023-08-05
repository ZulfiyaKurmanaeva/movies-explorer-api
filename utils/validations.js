const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const { celebrate, Joi } = require('celebrate');

const BadRequestError = require('../errors/BadRequestError');
const { invalidURL, invalidEmailForm } = require('./errorMessages');

const validationUrl = (url) => {
  if (isURL(url)) {
    return url;
  }
  throw new BadRequestError(invalidURL);
};

const validationEmail = (email) => {
  if (isEmail(email)) {
    return email;
  }
  throw new BadRequestError(invalidEmailForm);
};

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validationEmail),
    password: Joi.string().required(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validationEmail),
  }),
});

const validationGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationUrl),
    trailerLink: Joi.string().required().custom(validationUrl),
    thumbnail: Joi.string().required().custom(validationUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationUpdateUser,
  validationGetUser,
  validateCreateMovie,
  validateDeleteMovie,
  validationCreateUser,
  validationLogin,
};