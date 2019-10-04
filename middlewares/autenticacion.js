var seed = require('../config/config');
var jwt = require('jsonwebtoken');

/******************************************
 ************** Chequear token ***********
 ******************************************/
exports.vericarToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, seed.SEED, (error, datos) => {
        if (error) {
            res.status(401).json({ mensaje: 'No esta autorizado para ejecutar esta acción, vuelva al loguearse' });
            return;
        }
        req.usuario = datos;
        next();
    });
}