const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const User = require('./models/User');

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error(err));

// ✅ Configurar sesiones
app.use(session({
  secret: 'secreto-super-seguro',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// ✅ Middleware para compartir el usuario actual en todas las vistas
app.use(async (req, res, next) => {
  if (req.session.userId) {
    res.locals.currentUser = await User.findById(req.session.userId);
  } else {
    res.locals.currentUser = null;
  }
  next();
});

// ✅ Cargar rutas (después de configurar sesiones)
app.use('/', authRoutes);
app.use('/', indexRoutes);

// ✅ Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});

