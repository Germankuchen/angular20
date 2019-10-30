// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

// Inicializar variables
var app = express();
var Usuario = require('../models/usuarioModel');
var autenticacion = require('../middlewares/autenticacion');


/*****************************************
 ******** Obtiene todos los usuario *******
 ******************************************/
app.get('/', (req, res, next) => {
    var offset = req.query.desde;
    if (offset === null) {
        offset = 0;
    }
    offset = Number(offset);

    Usuario.find({}, 'nombre email img role').skip(offset).limit(5).exec((error, losUsuarios) => {
        if (error) {
            res.status(500).json({ mensaje: 'Se jodio la BD' });
            return;
        }
        Usuario.count({}, (error, total) => {
            if (error) {
                res.status(500).json({ mensaje: 'Error al obtener el total de usuarios' });
                return;
            }
            res.status(200).json({
                usuarios: losUsuarios,
                cantRegistros: total
            });
        });

    });
});

/*****************************************
 ************** Crea un usuario ***********
 ******************************************/
app.post('/', /*autenticacion.vericarToken,*/ (req, res) => {
    var body = req.body;
    if (body.password == null) {
        res.status(400).json({
            mensaje: 'La contraseña es obligatoria'
        });
        return;
    }
    var hash = bcrypt.hashSync(body.password, 10);
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: hash,
        img: body.img,
        role: body.role,
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Error al crear el usuario',
                error: error
            });
            return;
        }
        res.status(201).json({
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

/*****************************************
 ********** Actualiza un usuario *********
 *****************************************/
app.put('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar el usuario',
                error: error
            });
            return;
        }
        if (!usuario) {
            res.status(400).json({
                mensaje: 'No se encontró el usuario a modificar'
            });
            return;
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                res.status(400).json({
                    mensaje: 'Error al modificar el usuario',
                    error: error
                });
                return;
            }
            res.status(200).json(usuarioGuardado);
        });
    });
});

/*****************************************
 ********** Elimina un usuario ***********
 *****************************************/
app.delete('/:id', autenticacion.vericarToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (error, usuarioEliminado) => {
        if (error) {
            res.status(500).json({
                mensaje: 'Problema al buscar y eliminar el usuario',
                error: error
            });
            return;
        }
        if (!usuarioEliminado) {
            res.status(400).json({
                mensaje: 'No existe un usuario con ese ID'
            });
            return;
        }
        res.status(200).json({ mensaje: 'Se quitó el usuario correctamente' });
    });
});

module.exports = app;