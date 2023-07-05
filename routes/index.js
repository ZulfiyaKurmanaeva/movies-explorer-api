const router = require('express').Router();

const userRoutes = require('./users');
const movieRoutes = require('./movies');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

const { validationCreateUser, validationLogin } = require('../utils/validations');

const { invalidURL } = require('../utils/errorMessages');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/', userRoutes);
router.use('/', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError(invalidURL));
});

module.exports = router;
