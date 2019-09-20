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
    Hospital.find({}, 'nombre img usuario', (error, Hospitales) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        res.status(200).json(Hospitales);
    });
});

/*****************************************
 ************** Crea un hospital ***********
 ******************************************/
app.post('/', autenticacion.vericarToken, (req, res) => {
    var body = req.body;
    if (body.nombre == null) {
        res.status(400).json({
            mensaje: 'El nombre es obligatorio'
        });
        return;
    }
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario.id,
    });

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Error al crear el hospital',
                error: error
            });
            return;
        }
        res.status(201).json({
            hospital: hospitalGuardado
        });
    });
});

/*****************************************
 ********** Actualiza un hospital *********
 *****************************************/
app.put('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error, hospital) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar el hospital',
                error: error
            });
            return;
        }
        if (!hospital) {
            res.status(400).json({
                mensaje: 'No se encontró el hospital a modificar'
            });
            return;
        }

        hospital.nombre = body.nombre;

        hospital.save((error, hospitalGuardado) => {
            if (error) {
                res.status(400).json({
                    mensaje: 'Error al modificar el hospital',
                    error: error
                });
                return;
            }
            res.status(200).json(hospitalGuardado);
        });
    });
});

/*****************************************
 ********** Elimina un usuario ***********
 *****************************************/
app.delete('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalEliminado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar y eliminar el hospital',
                error: error
            });
            return;
        }
        if (!hospitalEliminado) {
            res.status(400).json({
                mensaje: 'No existe un hospital con ese ID'
            });
            return;
        }
        res.status(200).json({ mensaje: 'Se quitó el hospital correctamente' });
    });
});

module.exports = app;