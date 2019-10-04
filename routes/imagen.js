// Requires
var express = require('express');

// Inicializar variables
var app = express();
var Medico = require('../models/medicoModel');


/*****************************************
 ****** Obtiene todos los medicos *****
 *****************************************/
app.get('/:coleccion/:nombreImagen', (req, res, next) => {

    var coleccion = req.params.coleccion;
    var nombreImagen = req.params.nombreImagen;


    res.status(200).json({ coleccion: coleccion, imagen: nombreImagen });

});

module.exports = app;