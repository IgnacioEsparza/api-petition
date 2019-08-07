'use strict'

const User = require('../models/user')
const service = require('../services')

const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

var salt = bcrypt.genSaltSync(10);

function signUp(req, res) {
    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
    })

    user.save((err) => {

        if (err) {
            return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
        }

        return res.status(201).send({ token: service.createToken(user) })
    })
}

function signIn(req, res) {
    User.findOne({ email: req.body.email }).select('+password').exec(function (err, user) {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: 'No existe el usuario' })

        //console.log('Body : ' + req.body.password + ' Mongo: ' + user.password)

        bcrypt.compare(req.body.password, user.password, function (err, decrypt) {
            if(err) return res.status(500).send({ message: err});

            if (decrypt) {
                req.user = user
                res.status(200).send({
                    message: 'Logueado correctamente',
                    token: service.createToken(user)
                })
            } else {
                return res.status(500).send({ message: "Contraseña incorrecta" })
            }
        })
    })
}

function getUser(req, res) {

    let userId = req.params.userId;

    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición ${err}` });
        }
        if (!user) {
            return res.status(404).send({ message: `Usuario inexistente` });
        }

        res.status(200).send({ user: user });
    })

}

function getUsers(req, res) {

    User.find({}, (err, user) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición ${err}` });
        }

        if (!user) {
            return res.status(404).send({ message: `No existen usuarios` });
        }

        res.status(200).send({ user: user })
    })

}

function deleteUser(req, res) {

    let userId = req.params.userId;

    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: `Error al borrar usuario en la base de datos ${err}` });
        }

        user.remove(err => {
            if (err) {
                res.status(500).send({ message: `Error al borrar usuario en la base de datos ${err}` });
            }
            res.status(200).send({ message: 'Usuario ha sido eliminado correctamente' });
        })
    })

}

function updateUser(req, res) {

    let userId = req.params.userId;
    let update = req.body;

    update.password = bcrypt.hashSync(req.body.password, salt);

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });
        }
        return res.status(200).send({ user: userUpdated });
    });

}

module.exports = {
    signUp,
    signIn,
    getUser,
    getUsers,
    deleteUser,
    updateUser
}

