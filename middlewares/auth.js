const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { secret } = require('../config');
const { authErr } = require('../utils/errorMessages');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotAuthError(authErr);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secret, { expiresIn: '7d' });
  } catch (err) {
    next(new NotAuthError(authErr));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
