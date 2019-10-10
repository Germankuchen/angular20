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
    await verify(token).then(info => {
        return res.status(200).json({
            mensaje: 'Token válido',
            info: info
        });
    }).catch(e => {
        return res.status(403).json({
            mensaje: 'Token no válido',
            token: token,
            idCliente: CLIENT_ID,
            error: e
        });
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