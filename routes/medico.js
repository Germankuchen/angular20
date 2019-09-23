// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

// Inicializar variables
var app = express();
var Medico = require('../models/medicoModel');
var autenticacion = require('../middlewares/autenticacion');


/*****************************************
 ****** Obtiene todos los medicos *****
 *****************************************/
app.get('/', (req, res, next) => {
    Medico.find({}).exec((error, medicos) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        res.status(200).json(medicos);
    });
});

/*****************************************
 ************** Crea un Medico ***********
 ******************************************/
app.post('/', autenticacion.vericarToken, (req, res) => {
    var body = req.body;
    if (body.nombre == null) {
        res.status(400).json({
            mensaje: 'El nombre es obligatorio'
        });
        return;
    }
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario.id,
    });

    medico.save((error, medicoGuardado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Error al crear el medico',
                error: error
            });
            return;
        }
        res.status(201).json({
            medico: medicoGuardado
        });
    });
});

/*****************************************
 ********** Actualiza un medico *********
 *****************************************/
app.put('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (error, medico) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar el medico',
                error: error
            });
            return;
        }
        if (!medico) {
            res.status(400).json({
                mensaje: 'No se encontró el medico a modificar'
            });
            return;
        }

        medico.nombre = body.nombre;

        medico.save((error, medicoGuardado) => {
            if (error) {
                res.status(400).json({
                    mensaje: 'Error al modificar el medico',
                    error: error
                });
                return;
            }
            res.status(200).json(medicoGuardado);
        });
    });
});

/*****************************************
 ********** Elimina un medico ***********
 *****************************************/
app.delete('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (error, medicoEliminado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar y eliminar el medico',
                error: error
            });
            return;
        }
        if (!medicoEliminado) {
            res.status(400).json({
                mensaje: 'No existe un medico con ese ID'
            });
            return;
        }
        res.status(200).json({ mensaje: 'Se quitó el medico correctamente' });
    });
});

module.exports = app;