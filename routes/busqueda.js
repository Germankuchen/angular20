// Requires
var express = require('express');

// Inicializar variables
var app = express();
var Hospital = require('../models/hospitalModel');
var Medico = require('../models/medicoModel');
var Usuario = require('../models/usuarioModel');

/*****************************************
 ****** Obtiene todos los hospitales *****
 *****************************************/
app.get('/todo/:param', (req, res, next) => {
    var parametro = req.params.param;
    var regex = new RegExp(parametro, 'i');

    Hospital.find({ nombre: regex }, (error, hospitales) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        res.status(200).json({
            mensaje: "esta buscando: " + parametro,
            hospitales: hospitales
        });
    });


});


module.exports = app;