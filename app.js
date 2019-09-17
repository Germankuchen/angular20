// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conectar a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, info) => {
    if (err) {
        throw err;
    }
    console.log('BD esta ejecutandose en el puerto 27017');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({ mensaje: 'OK' });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor express corriendo en el puerto 3000');
});