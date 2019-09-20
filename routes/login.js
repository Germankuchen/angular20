// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var seed = require('../config/config');

// Inicializar variables
var app = express();
var Usuario = require('../models/usuarioModel');

app.post('/', (req, res) => {

    var body = req.body;
    if (!body.email) {
        res.status(400).json({
            mensaje: 'El email es obligatorio'
        });
        return;
    }
    if (!body.password) {
        res.status(400).json({
            mensaje: 'La contraseña es obligatoria'
        });
        return;
    }
    var hash = bcrypt.hashSync(body.password, 10);

    Usuario.findOne({ email: body.email }, (error, usuario) => {
        if (error) {
            res.status(500).json({
                mensaje: 'No se logró realizar la búsqueda',
                error: error
            });
            return;
        }
        if (!usuario) {
            res.status(400).json({
                mensaje: 'El email ingresado no corresponde con ningun usuario'
            });
            return;
        }
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            res.status(400).json({
                mensaje: 'La contraseña ingresada es incorrecta'
            });
            return;
        }
        usuario.password = ':)';
        var token = jwt.sign({ nombre: usuario.nombre, email: usuario.email }, seed.SEED, { expiresIn: 14400 });

        res.status(200).json({
            mensaje: 'Se puede loguear',
            usuario: usuario,
            token: token
        });
    });

});

module.exports = app;