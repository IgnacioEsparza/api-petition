'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropuestaSchema = Schema({
    title: String,
    categoria: {type: String, enum: ['Salud', 'Medioambiente', 'Entrenimiento', 'Educación', 'Animales', 'Otros']},
    descripcion: String,
    imagen: String,
    icon: {type: String, enum: ['hospital', 'pine-tree-box', 'play-circle', 'school', 'paw', 'bandage']},
    fecha: String,
});

module.exports = mongoose.model('Propuesta', PropuestaSchema);