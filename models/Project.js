const mongoose = require('mongoose'); //importa mongoose para interactuar con la base de datos

const ProjectSchema = new mongoose.Schema({ //define el esquema del proyecto
  name: String, //nombre del proyecto
  createdAt: { type: Date, default: Date.now } //fecha de creación, por defecto es la fecha actual
});

module.exports = mongoose.model('Project', ProjectSchema); //exporta el modelo de proyecto basado en el esquema
