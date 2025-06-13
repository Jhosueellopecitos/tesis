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
exports.obtenerTareaPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
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

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tareaActualizada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// Obtener todas las tareas de un usuario
exports.obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ usuario_id: req.params.usuario_id });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
