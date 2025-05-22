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


exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (usuario.contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // ✅ DEVOLVER también el nombre
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      _id: usuario._id,
      nombre: usuario.nombre
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

