const express = require('express');
const router = express.Router();
const { crearTarea, obtenerTareas, eliminarTarea } = require('../controller/tareacontroller');

// Crear tarea
router.post('/', crearTarea);

// Obtener tareas de un usuario
router.get('/:usuario_id', obtenerTareas);

// Eliminar tarea
router.delete('/:id', eliminarTarea);

module.exports = router;
