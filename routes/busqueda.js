// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

// Inicializar variables
var app = express();
var Hospital = require('../models/hospitalModel');
var autenticacion = require('../middlewares/autenticacion');

/*****************************************
 ****** Obtiene todos los hospitales *****
 *****************************************/
app.get('/', (req, res, next) => {
    var offset = req.query.desde;
    if (offset === null) {
        offset = 0;
    }
    offset = Number(offset);

    Hospital.find({}).skip(offset).limit(5).exec((error, hospitales) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        Hospital.count({}, (error, total) => {
            if (error) {
                res.status(500).json({ mensaje: 'Error al obtener el total de hospitales' });
                return;
            }
            res.status(200).json({ hospitales: hospitales, total: total });
        });
    });
});