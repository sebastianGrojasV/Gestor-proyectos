// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error(err));

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
