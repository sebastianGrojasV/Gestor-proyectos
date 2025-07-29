const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: String,
  description: String, // <- nuevo campo
  status: { type: String, default: 'pendiente' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Task', taskSchema);

