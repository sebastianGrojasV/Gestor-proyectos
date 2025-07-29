const express = require('express'); // Importa Express
const router = express.Router(); // Crea una nueva instancia del router de Express
const Project = require('../models/Project'); // Importa el modelo Project
const Task = require('../models/Task'); // Importa el modelo Task

// Ruta para mostrar todos los proyectos
router.get('/', async (req, res) => {
  const projects = await Project.find(); // Obtiene todos los proyectos
  res.render('index', { projects }); // Renderiza la vista 'index' con los proyectos
});

// Ruta para agregar un nuevo proyecto
router.post('/add-project', async (req, res) => {
  await Project.create({ name: req.body.name }); // Crea un nuevo proyecto con el nombre proporcionado
  res.redirect('/'); // Redirige a la página principal
});

// Ruta para ver los detalles de un proyecto y sus tareas
router.get('/project/:id', async (req, res) => {
  const estado = req.query.estado; // Obtiene el estado de la consulta
  const project = await Project.findById(req.params.id); // Busca el proyecto por ID

  let filtro = { projectId: project._id }; // Filtro para obtener las tareas del proyecto
  if (estado === 'pendiente' || estado === 'completada') { // Si el estado es pendiente o completada, filtra las tareas
    filtro.status = estado;
  }

  const tasks = await Task.find(filtro); // Obtiene las tareas según el filtro
  res.render('project', { project, tasks, estado }); // Renderiza la vista del proyecto con las tareas filtradas
});

// Ruta para agregar una nueva tarea a un proyecto
router.post('/project/:id/add-task', async (req, res) => {
  await Task.create({ projectId: req.params.id, description: req.body.description }); // Crea una nueva tarea para el proyecto
  res.redirect(`/project/${req.params.id}`); // Redirige a la vista del proyecto
});

// Ruta para alternar el estado de una tarea (pendiente/completada)
router.post('/task/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id); // Busca la tarea por ID
  task.status = task.status === 'pendiente' ? 'completada' : 'pendiente'; // Alterna el estado de la tarea
  await task.save(); // Guarda los cambios en la tarea
  res.redirect(`/project/${task.projectId}`); // Redirige a la vista del proyecto correspondiente
});

// Ruta para eliminar una tarea
router.post('/task/:id/delete', async (req, res) => {
  const task = await Task.findById(req.params.id); // Busca la tarea por ID
  const projectId = task.projectId; // Obtiene el ID del proyecto relacionado
  await Task.findByIdAndDelete(req.params.id); // Elimina la tarea por ID
  res.redirect(`/project/${projectId}`); // Redirige a la vista del proyecto correspondiente
});

// Ruta duplicada para eliminar una tarea (eliminar esta ruta)
router.post('/task/:id/delete', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id); // Elimina la tarea por ID
  res.redirect('back'); // Redirige a la página anterior
});

// Ruta para agregar una tarea directamente a un proyecto
router.post('/project/:id/task', async (req, res) => {
  const { name, description } = req.body; // Obtiene el nombre y la descripción de la tarea
  const task = new Task({ name, description, projectId: req.params.id }); // Crea una nueva tarea
  await task.save(); // Guarda la tarea en la base de datos
  res.redirect(`/project/${req.params.id}`); // Redirige a la vista del proyecto
});

// Ruta para mostrar el formulario de edición de un proyecto
router.get('/project/:id/edit', async (req, res) => {
  const project = await Project.findById(req.params.id); // Busca el proyecto por ID
  res.render('editProject', { project }); // Renderiza la vista de edición del proyecto
});

// Ruta para procesar la edición de un proyecto
router.post('/project/:id/update', async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { name: req.body.name }); // Actualiza el nombre del proyecto
  res.redirect('/'); // Redirige a la página principal
});

// Ruta para mostrar el formulario de edición de una tarea
router.get('/task/:id/edit', async (req, res) => {
  const task = await Task.findById(req.params.id); // Busca la tarea por ID
  const project = await Project.findById(task.projectId); // Busca el proyecto relacionado
  res.render('editTask', { task, project }); // Renderiza la vista de edición de la tarea
});

// Ruta para procesar la edición de una tarea
router.post('/task/:id/update', async (req, res) => {
  const { name, description } = req.body; // Obtiene el nombre y la descripción de la tarea
  const task = await Task.findById(req.params.id); // Busca la tarea por ID
  await Task.findByIdAndUpdate(req.params.id, { name, description }); // Actualiza la tarea
  res.redirect(`/project/${task.projectId}`); // Redirige a la vista del proyecto correspondiente
});

module.exports = router; // Exporta el router

