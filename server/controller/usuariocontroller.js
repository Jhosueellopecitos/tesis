const Usuario = require('../models/Usuario');

exports.registrar = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};