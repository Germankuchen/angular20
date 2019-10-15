var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, require: [true, 'El Email es obligatorio'] },
    password: { type: String, require: [true, 'La contraseña es obligatoria'] },
    img: { type: String },
    role: { type: String, require: true, default: 'USER_ROLE' },
    esUsuarioGoogle: { type: Boolean, default: false }

});

module.exports = mongoose.model('Usuarios', usuarioSchema);