const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Project', projectSchema);

