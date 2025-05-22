const Tarea = require('../models/Tarea');

// Crear nueva tarea
exports.crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener tareas por usuario
exports.obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario_id: req.params.usuario_id });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
