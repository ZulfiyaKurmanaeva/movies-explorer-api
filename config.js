const {
  NODE_ENV,
  JWT_SECRET,
  PORT = 3001,
  MONGO_DB = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const jwtToken = 'JWT-token';

const secret = NODE_ENV === 'production' ? JWT_SECRET : jwtToken;

module.exports = {
  PORT,
  MONGO_DB,
  secret,
  jwtToken,
};