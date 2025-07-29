const mongoose = require('mongoose'); //importa mongoose para interactuar con la base de datos
const Schema = mongoose.Schema; //asigna el objeto Schema de mongoose a una variable

const taskSchema = new Schema({ //define el esquema de tarea
  name: String, //nombre de la tarea
  description: String, //descripción de la tarea
  status: { type: String, default: 'pendiente' }, //estado de la tarea, por defecto es 'pendiente'
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' } //referencia al proyecto asociado
});

module.exports = mongoose.model('Task', taskSchema); //exporta el modelo de tarea basado en el esquema


