const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const requireLogin = require('../middleware/requireLogin'); // Asegura que el usuario esté logueado

// Mostrar todos los proyectos del usuario
router.get('/', requireLogin, async (req, res) => {
  const projects = await Project.find({ userId: req.session.userId });
  res.render('index', { projects });
});

// Crear nuevo proyecto
router.post('/add-project', requireLogin, async (req, res) => {
  await Project.create({
    name: req.body.name,
    userId: req.session.userId
  });
  res.redirect('/');
});

// Ver un proyecto y sus tareas
router.get('/project/:id', requireLogin, async (req, res) => {
  const estado = req.query.estado;
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!project) return res.redirect('/');

  let filtro = { projectId: project._id, userId: req.session.userId };
  if (estado === 'pendiente' || estado === 'completada') {
    filtro.status = estado;
  }

  const todasLasTareas = await Task.find(filtro);

  const hoy = new Date();
  const urgentes = [];
  const vencidas = [];
  const proximas = [];
  const completadas = [];

  todasLasTareas.forEach(task => {
    if (task.status === 'completada') {
      completadas.push(task);
    } else if (task.limitDate) {
      const fecha = new Date(task.limitDate);
      const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
      if (fecha < hoy) vencidas.push(task);
      else if (diasRestantes <= 7) urgentes.push(task);
      else proximas.push(task);
    } else {
      proximas.push(task);
    }
  });

  res.render('project', {
    project,
    urgentes,
    vencidas,
    proximas,
    completadas,
    estado
  });
});

// Agregar tarea
router.post('/project/:id/task', requireLogin, async (req, res) => {
  const { name, description, limitDate } = req.body;

  const project = await Project.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!project) return res.redirect('/');

  const task = new Task({
    name,
    description,
    limitDate: limitDate ? new Date(limitDate) : null,
    projectId: project._id,
    userId: req.session.userId
  });

  await task.save();
  res.redirect(`/project/${project._id}`);
});

// Cambiar estado de la tarea
router.post('/task/:id/toggle', requireLogin, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!task) return res.redirect('/');

  task.status = task.status === 'pendiente' ? 'completada' : 'pendiente';
  await task.save();

  res.redirect(`/project/${task.projectId}`);
});

// Eliminar tarea
router.post('/task/:id/delete', requireLogin, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!task) return res.redirect('/');

  await Task.deleteOne({ _id: req.params.id });
  res.redirect(`/project/${task.projectId}`);
});

// Mostrar formulario de edición de proyecto
router.get('/project/:id/edit', requireLogin, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!project) return res.redirect('/');
  res.render('editProject', { project });
});

// Actualizar proyecto
router.post('/project/:id/update', requireLogin, async (req, res) => {
  await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    { name: req.body.name }
  );
  res.redirect('/');
});

// Editar tarea (formulario)
router.get('/task/:id/edit', requireLogin, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!task) return res.redirect('/');

  const project = await Project.findOne({ _id: task.projectId, userId: req.session.userId });
  if (!project) return res.redirect('/');

  res.render('editTask', { task, project });
});

// Actualizar tarea
router.post('/task/:id/update', requireLogin, async (req, res) => {
  const { name, description, limitDate } = req.body;

  const task = await Task.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!task) return res.redirect('/');

  await Task.findByIdAndUpdate(req.params.id, {
    name,
    description,
    limitDate: limitDate ? new Date(limitDate) : null
  });

  res.redirect(`/project/${task.projectId}`);
});

// Eliminar proyecto y sus tareas
router.post('/project/:id/delete', requireLogin, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!project) return res.redirect('/');

  await Task.deleteMany({ projectId: project._id, userId: req.session.userId });
  await Project.deleteOne({ _id: project._id });

  res.redirect('/');
});

module.exports = router;


