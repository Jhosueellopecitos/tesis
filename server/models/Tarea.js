const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  fecha_limite: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada'],
    default: 'pendiente'
  },
  recordatorio_activado: {
    type: Boolean,
    default: false
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true // Crea automáticamente campos createdAt y updatedAt
});

module.exports = mongoose.model('Tarea', TareaSchema);
