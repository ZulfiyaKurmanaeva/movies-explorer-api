const userRoutes = require('express')
  .Router();

const { getUser, updateUser } = require('../controllers/users');
const { validationGetUser, validationUpdateUser } = require('../utils/validations');

userRoutes.get('/users/me', validationGetUser, getUser);
userRoutes.patch('/users/me', validationUpdateUser, updateUser);

module.exports = userRoutes;