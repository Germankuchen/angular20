// Requires
var express = require('express');

// Inicializar variables
var app = express();
var Hospital = require('../models/hospitalModel');
var Medico = require('../models/medicoModel');
var Usuario = require('../models/usuarioModel');


/*****************************************
 *** Busca en una colección particular ***
 *****************************************/
app.get('/coleccion/:nombre/:param', (req, res, next) => {
    var parametro = req.params.param;
    var nombre = req.params.nombre;
    var regex = new RegExp(parametro, 'i');
    if (nombre == null) {
        res.status(500).json({ mensaje: 'falta ingresar el nombre de la colección' });
    }
    if (nombre == 'medicos') {
        buscarMedicos(regex).then((retorna) => {
            res.status(200).json({
                medicos: retorna
            });
            return;
        }).catch((error) => {
            res.status(500).json({ mensaje: error });
        });
    }
    if (nombre == 'usuarios') {
        buscarUsuarios(regex).then((retorna) => {
            res.status(200).json({
                usuarios: retorna
            });
            return;
        }).catch((error) => {
            res.status(500).json({ mensaje: error });
        });
    }
    if (nombre == 'hospitales') {
        buscarHospitales(regex).then((retorna) => {
            res.status(200).json({
                hospitales: retorna
            });
            return;
        }).catch((error) => {
            res.status(500).json({ mensaje: error });
        });
    }
    //   res.status(500).json({ mensaje: 'No se encontró la colección ' + nombre });
});

/*****************************************
 ***** Busca en todas las colecciones ****
 *****************************************/
app.get('/todo/:param', (req, res, next) => {
    var parametro = req.params.param;
    var regex = new RegExp(parametro, 'i');

    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)]).then((retorna) => {
        res.status(200).json({
            hospitales: retorna[0],
            medicos: retorna[1],
            usuarios: retorna[2]
        });
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

function buscarUsuarios(filtro) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: filtro }, 'nombre email role img', (error, usuarios) => {
            if (error) {
                reject('Hubo un problema al buscar en usuarios');
            }
            resolve(usuarios);
        });
    });
}


module.exports = app;