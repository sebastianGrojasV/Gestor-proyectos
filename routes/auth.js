const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Mostrar login
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesar login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.send('Usuario no encontrado');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send('Contraseña incorrecta');
  }

  req.session.userId = user._id;
  res.redirect('/');
});

// Mostrar registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Procesar registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      email,
      password: hash
    });

    req.session.userId = newUser._id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error al registrar el usuario');
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;