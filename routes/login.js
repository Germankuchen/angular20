// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var seed = require('../config/config');

// Inicializar variables
var app = express();
var Usuario = require('../models/usuarioModel');

// Necesario login google
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        'nombre': payload.name,
        'email': payload.email,
        'img': payload.picture,
        'google': true
    };
}


app.post('/google/', async(req, res) => {

    var token = req.body.token;
    var verificar = await verify(token).catch(e => {
        return res.status(403).json({
            mensaje: 'Token no válido',
            token: token,
            idCliente: CLIENT_ID,
            error: e
        });
    });
    Usuario.findOne({ 'email': verificar.email }, (error, usuarioBD) => {
        if (error) {
            res.status(500).json({
                mensaje: 'No se logró buscar el usuario por mail',
                error: error
            });
            return;
        }
        if (usuarioBD) {
            if (!usuarioBD.esUsuarioGoogle) {
                res.status(400).json({
                    mensaje: 'Debe autenticarse sin google',
                    error: error
                });
                return;
            } else {
                usuarioBD.password = ':)';
                var token = jwt.sign({
                    nombre: usuarioBD.nombre,
                    email: usuarioBD.email,
                    id: usuarioBD.id
                }, seed.SEED, { expiresIn: 14400 });

                res.status(200).json({
                    mensaje: 'Se puede loguear',
                    usuario: usuarioBD,
                    token: token
                });
            }
            var usuario = new Usuario();
            usuario.email = verificar.email;
            usuario.nombre = verificar.nombre;
            usuario.img = verficar.img;
            usuario.esUsuarioGoogle = true;
            usuario.password = ':)';

            usuario.save((error, usuarioGuardado) => {
                if (error) {
                    res.status(500).json({
                        mensaje: 'Error al crear el usuario',
                        error: error
                    });
                    return;
                }
                usuarioGuardado.password = ':)';
                var token = jwt.sign({
                    nombre: usuarioGuardado.nombre,
                    email: usuarioGuardado.email,
                    id: usuarioGuardado.id
                }, seed.SEED, { expiresIn: 14400 });

                res.status(200).json({
                    mensaje: 'Se puede loguear',
                    usuario: usuarioGuardado,
                    token: token
                });
            });
        }
    });

});

app.post('/', (req, res) => {

    var body = req.body;
    if (!body.email) {
        res.status(400).json({
            mensaje: 'El email es obligatorio'
        });
        return;
    }
    if (!body.password) {
        res.status(400).json({
            mensaje: 'La contraseña es obligatoria'
        });
        return;
    }
    var hash = bcrypt.hashSync(body.password, 10);

    Usuario.findOne({ email: body.email }, (error, usuario) => {
        if (error) {
            res.status(500).json({
                mensaje: 'No se logró realizar la búsqueda',
                error: error
            });
            return;
        }
        if (!usuario) {
            res.status(400).json({
                mensaje: 'El email ingresado no corresponde con ningun usuario'
            });
            return;
        }
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            res.status(400).json({
                mensaje: 'La contraseña ingresada es incorrecta'
            });
            return;
        }
        usuario.password = ':)';
        var token = jwt.sign({
            nombre: usuario.nombre,
            email: usuario.email,
            id: usuario.id
        }, seed.SEED, { expiresIn: 14400 });

        res.status(200).json({
            mensaje: 'Se puede loguear',
            usuario: usuario,
            token: token
        });
    });

});

module.exports = app;