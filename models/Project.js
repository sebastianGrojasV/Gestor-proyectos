const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
