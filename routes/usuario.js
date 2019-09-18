// Requires
var express = require('express');

// Inicializar variables
var app = express();

var Usuario = require('../models/usuarioModel');

// Rutas

/* Obtiene todos los usuario */
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role', (error, Usuarios) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        res.status(200).json(Usuarios);
    });
});

/* Crea un usuario */
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role,
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Error al crear el usuario',
                error: error
            });
            return;
        }
        res.status(201).json(usuarioGuardado);
    });
});

module.exports = app;