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

    buscarHospitales(regex).then((retorna) => {
        res.status(200).json({ hospitales: retorna });
    }).catch((error) => {
        res.status(500).json({ mensaje: error });
    });
});

function buscarHospitales(filtro) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: filtro }, (error, hospitales) => {
            if (error) {
                reject('Hubo un problema al buscar en hospitales');
            }
            resolve(hospitales);
        });
    });
}

function buscarMedicos(filtro) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: filtro }, (error, medicos) => {
            if (error) {
                reject('Hubo un problema al buscar en medicos');
            }
            resolve(medicos);
        });
    });
}


module.exports = app;