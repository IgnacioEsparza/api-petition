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
api.put('/propuesta/:propuestaId', propuestaCtrl.updatePropuesta);
api.delete('/propuesta/:propuestaId', propuestaCtrl.deletePropuesta);

api.get('/user/:userId', auth, userCtrl.getUser);
api.get('/user', auth, userCtrl.getUsers);
api.delete('/user/:userId', auth, userCtrl.deleteUser);
api.put('/user/:userId', auth, userCtrl.updateUser);

api.post('/signup', userCtrl.signUp);
api.post('/login', userCtrl.signIn);
api.get('/private', auth, function (req, res) {
    res.status(200).send({ menssage: 'Autenticado correctamente' })
})

module.exports = api;