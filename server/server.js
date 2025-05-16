const express = require('express');
const mongoose = require('mongoose');
const usuarioRoutes = require('./router/usuarioRoutes');
const app = express();

mongoose.connect('mongodb://localhost/clauds');

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
