const express = require('express');
const router = express.Router();

const {
  crearTarea,
  obtenerTareas,
  eliminarTarea,
  obtenerTareaPorId,
  actualizarTarea
} = require('../controller/tareacontroller'); // asegúrate que esté todo en minúscula o coincida exactamente con el nombre del archivo

// Crear tarea
router.post('/', crearTarea);

// Obtener tareas por usuario
router.get('/:usuario_id', obtenerTareas);

// Obtener una tarea por ID
router.get('/detalle/:id', obtenerTareaPorId);

// Actualizar tarea por ID
router.put('/:id', actualizarTarea);

// Eliminar tarea
router.delete('/:id', eliminarTarea);

module.exports = router;
