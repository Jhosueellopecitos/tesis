
const express = require('express');
const router = express.Router();
const { registrar } = require('../controller/usuariocontroller');

router.post('/registro', registrar);

module.exports = router;
