// Requires
var express = require('express');

// Inicializar variables
var app = express();

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({ mensaje: 'OK' });
});

module.exports = app;