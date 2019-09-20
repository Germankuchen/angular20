// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables
var app = express();

// Importar ruta principal
var rutaRaiz = require('./routes/raiz');
var rutaUsuario = require('./routes/usuario');
var rutaLogin = require('./routes/login');
var rutaHospital = require('./routes/hospital');
var rutaMedico = require('./routes/medico');

// Configuración Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conectar a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, info) => {
    if (err) {
        throw err;
    }
    console.log('BD esta ejecutandose en el puerto 27017');
});

app.get('/', (req, res, next) => {
    res.status(200).json({ mensaje: 'OK' });
});

// Rutas
app.use('/usuario', rutaUsuario);
app.use('/login', rutaLogin);
app.use('/hospital', rutaHospital);
app.use('/medico', rutaMedico);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor express corriendo en el puerto 3000');
});