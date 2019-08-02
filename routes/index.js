'use strict'

const express = require('express');

const api = express.Router();
const auth = require('../middleware/auth')

const propuestaCtrl = require('../controllers/propuesta');
const userCtrl = require('../controllers/user')

api.get('/propuesta', propuestaCtrl.getPropuestas);
api.get('/propuesta/:propuestaId', propuestaCtrl.getPropuesta);

// api.post('/propuesta', auth, propuestaCtrl.savePropuesta);
api.post('/propuesta', propuestaCtrl.savePropuesta);
api.put('/propuesta/:propuestaId' auth, propuestaCtrl.updatePropuesta);
api.delete('/propuesta/:propuestaId', auth, propuestaCtrl.deletePropuesta);

api.post('/signup', userCtrl.signUp);
api.post('/login', userCtrl.signIn);
api.get('/private', auth, function (req, res) {
    res.status(200).send({ menssage: 'Autenticado correctamente' })
})

module.exports = api;