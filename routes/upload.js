// Requires
var express = require('express');
var fileUpload = require('express-fileupload');

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

    archivo.mv('./uploads/' + coleccion + '/' + nombreArchivo, function(err) {
        if (err) {
            return res.status(500).send({
                error: 'No se puede guardar el archivo',
                detalle: err
            });
        }
    });

    res.status(200).json({
        mensaje: 'Estamos en el upload',
        extension: extension
    });
});

module.exports = app;