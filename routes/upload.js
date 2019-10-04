// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var Medico = require('../models/medicoModel');
var Hospital = require('../models/hospitalModel');
var Usuario = require('../models/usuarioModel');
var fs = require('fs');

// Inicializar variables
var app = express();

app.use(fileUpload());
/*****************************************
 ******** Permite subir un archivo *******
 ******************************************/
app.put('/:coleccion/:id', (req, res, next) => {
    var coleccion = req.params.coleccion;
    var id = req.params.id;
    if (!req.files) {
        res.status(400).json({ mensaje: 'Error no hay archivo para subir' });
        return;
    }
    var archivo = req.files.imagen;
    var partesDelNombre = archivo.name.split('.');
    var extension = partesDelNombre[partesDelNombre.length - 1];
    var extensionesValidas = ['jpg', 'gif', 'png'];
    if (!extensionesValidas.includes(extension.toLowerCase())) {
        res.status(400).json({ mensaje: 'Debe subir un archivo con extension jpg, gif o png' });
        return;
    }
    var nombreArchivo = id + '-' + (new Date()).getTime() + '.' + extension;
    var path = './uploads/' + coleccion + '/' + nombreArchivo;

    archivo.mv(path, function(err) {
        if (err) {
            return res.status(500).send({
                error: 'No se puede guardar el archivo',
                detalle: err
            });
        }
    });

    // res.status(200).json({
    //     mensaje: 'Estamos en el upload',
    //     extension: extension
    // });

    subirXTipo(coleccion, id, nombreArchivo, res);

});

function subirXTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (error, usuario) => {
            if (error) {
                return res.status(500).send({
                    error: 'No se encontró el usuario',
                    detalle: error
                });
            }
            if (!usuario) {
                return res.status(400).send({
                    error: 'No se encontró el usuario'
                });
            }
            var pathImagenVieja = './uploads/' + tipo + '/' + usuario.img;

            // Busca y elimina el archivo si ya existía
            if (fs.existsSync(pathImagenVieja)) {
                fs.unlinkSync(pathImagenVieja);
            }
            usuario.img = nombreArchivo;
            usuario.save((error, usuarioModificado) => {
                res.status(200).json({
                    mensaje: 'Se actualizó la imagen correctamente',
                    usuario: usuarioModificado
                });
            });
        });
        return;
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (error, medico) => {
            if (error) {
                return res.status(500).send({
                    error: 'No se encontró el medico',
                    detalle: error
                });
            }
            if (!medico) {
                return res.status(400).send({
                    error: 'No se encontró el medico'
                });
            }
            var pathImagenVieja = './uploads/' + tipo + '/' + medico.img;

            // Busca y elimina el archivo si ya existía
            if (fs.existsSync(pathImagenVieja)) {
                fs.unlinkSync(pathImagenVieja);
            }
            medico.img = nombreArchivo;
            medico.save((error, medicoModificado) => {
                res.status(200).json({
                    mensaje: 'Se actualizó el medico correctamente',
                    medico: medicoModificado
                });
            });
        });
        return;
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {
            if (error) {
                return res.status(500).send({
                    error: 'No se encontró el medico',
                    detalle: error
                });
            }
            if (!hospital) {
                return res.status(400).send({
                    error: 'No se encontró el hospital'
                });
            }
            var pathImagenVieja = './uploads/' + tipo + '/' + hospital.img;

            // Busca y elimina el archivo si ya existía
            if (fs.existsSync(pathImagenVieja)) {
                fs.unlinkSync(pathImagenVieja);
            }
            hospital.img = nombreArchivo;
            hospital.save((error, hospitalModificado) => {
                res.status(200).json({
                    mensaje: 'Se actualizó el hospital correctamente',
                    hospital: hospitalModificado
                });
            });
        });
        return;
    }
}

module.exports = app;