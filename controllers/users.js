const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const MongoDuplicateKeyError = require('../errors/MongoDuplicateKeyError');

const {emailExists, invalidUpdateUser, invalidCreateUser, invalidId, notFoundUser, userExists} = require('../utils/errorMessages');

const { secret } = require('../config');

const saltRounds = 10;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  userSchema
    .findById(userId)
    .orFail(() => {
      throw new NotFoundError(invalidId);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(notFoundUser));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, saltRounds)
    .then((hash) => userSchema.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new MongoDuplicateKeyError(emailExists));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidCreateUser));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => {
      next (new NotFoundError(invalidId));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new MongoDuplicateKeyError(userExists));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidUpdateUser));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
