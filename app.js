// app.js
const express = require('express'); // Importa el módulo Express
const mongoose = require('mongoose'); // Importa el módulo Mongoose para interactuar con MongoDB
const dotenv = require('dotenv'); // Importa el módulo dotenv para manejar variables de entorno
const app = express(); // Crea una instancia de Express

dotenv.config(); // Carga las variables de entorno desde el archivo .env
app.set('view engine', 'ejs'); // Establece EJS como el motor de plantillas para renderizar vistas
app.use(express.urlencoded({ extended: true })); // Permite el análisis de datos codificados en URL (req.body)
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

mongoose.connect(process.env.MONGO_URI) // Conecta a MongoDB usando la URI almacenada en las variables de entorno
  .then(() => console.log('Conectado a MongoDB Atlas')) // Si la conexión es exitosa, muestra un mensaje en consola
  .catch((err) => console.error(err)); // Si hay un error, lo captura y muestra en consola

const indexRoutes = require('./routes/index'); // Importa las rutas desde el archivo index.js en la carpeta routes
app.use('/', indexRoutes); // Usa las rutas definidas en el archivo indexRoutes para las peticiones a la raíz '/'

app.listen(3000, () => { // Inicia el servidor en el puerto 3000
  console.log('Servidor en http://localhost:3000'); // Muestra un mensaje indicando que el servidor está en funcionamiento
});

