const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 importa cors
const usuarioRoutes = require('./router/usuarioRoutes');
const tareaRoutes = require('./router/tareaRoutes');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/clauds', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar con MongoDB:', err));

// Habilita CORS para todos los orígenes
app.use(cors()); // 👈 esto es clave
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tareas', tareaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
