require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./utils/rateLimit');

const router = require('./routes/index');

const errorHandler = require('./utils/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(helmet());

app.use(limiter);

app.use(limiter);

app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const { MONGO_DB, PORT } = require('./config');

mongoose.connect(MONGO_DB);

async function start() {
  try {
    await mongoose.connect(MONGO_DB);
    await app.listen(PORT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

start()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Приложение успешно запущенно!\n${MONGO_DB}\nPort: ${PORT}`));