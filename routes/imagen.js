// Requires
var express = require('express');

// Inicializar variables
var app = express();
const path = require('path');
const fs = require('fs');

var Medico = require('../models/medicoModel');


/*****************************************
 ****** Obtiene todos los medicos *****
 *****************************************/
app.get('/:coleccion/:nombreImagen', (req, res, next) => {

    var coleccion = req.params.coleccion;
    var nombreImagen = req.params.nombreImagen;

    var url = path.resolve(__dirname, '../uploads/' + coleccion + '/' + nombreImagen);

    if (fs.existsSync(url)) {
        res.sendFile(url);
    } else {
        var url2 = path.resolve(__dirname, '../assets/img/no-img.jpg');
        res.sendFile(url2);
    }

});

module.exports = app;