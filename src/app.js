const express = require('express');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/v1/users', userRoutes);
app.use('/v1/accounts', accountRoutes);
app.use('/v1/accounts', transactionRoutes);
app.use('/v1/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
