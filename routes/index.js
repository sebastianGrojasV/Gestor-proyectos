const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.render('index', { projects });
});

router.post('/add-project', async (req, res) => {
  await Project.create({ name: req.body.name });
  res.redirect('/');
});

router.get('/project/:id', async (req, res) => {
  const estado = req.query.estado;
  const project = await Project.findById(req.params.id);

  let filtro = { projectId: project._id };
  if (estado === 'pendiente' || estado === 'completada') {
    filtro.status = estado;
  }

  const tasks = await Task.find(filtro);
  res.render('project', { project, tasks, estado });
});


router.post('/project/:id/add-task', async (req, res) => {
  await Task.create({ projectId: req.params.id, description: req.body.description });
  res.redirect(`/project/${req.params.id}`);
});

router.post('/task/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = task.status === 'pendiente' ? 'completada' : 'pendiente';
  await task.save();
  res.redirect(`/project/${task.projectId}`);
});

router.post('/task/:id/delete', async (req, res) => {
  const task = await Task.findById(req.params.id);
  const projectId = task.projectId;
  await Task.findByIdAndDelete(req.params.id);
  res.redirect(`/project/${projectId}`);
});


router.post('/task/:id/delete', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('back');
});

router.post('/project/:id/task', async (req, res) => {
  const { name, description } = req.body;
  const task = new Task({ name, description, projectId: req.params.id });
  await task.save();
  res.redirect(`/project/${req.params.id}`);
});


module.exports = router;
