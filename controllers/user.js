'use strict'

const User = require('../models/user');
const Propose = require('../models/propuesta');
const service = require('../services');

const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

var salt = bcrypt.genSaltSync(10);

function signUp(req, res) {
    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
    })

    if (!validacion(user.email)) return res.status(422).send({ message: `Error al crear el usuario` });
    if (!validacion(user.displayName)) return res.status(422).send({ message: `Error al crear el usuario` });
    if (!validacion(user.password)) return res.status(422).send({ message: `Error al crear el usuario` });

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
            if (err) return res.status(500).send({ message: err });

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

    let userId = req.user;

    User.findById(userId).populate('propuestasApoyadas').exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición ${err}` });
        }
        if (!user) {
            return res.status(404).send({ message: `Usuario inexistente` });
        }

        res.status(200).send({ user: user });
    })

    // User.findById(userId, (err, user) => {
    //     if (err) {
    //         return res.status(500).send({ message: `Error al realizar la petición ${err}` });
    //     }
    //     if (!user) {
    //         return res.status(404).send({ message: `Usuario inexistente` });
    //     }

    //     res.status(200).send({ user: user });
    // })

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
        if (!user) return res.status(404).send({ message: 'No existe el usuario' })
        user.remove(err => {
            if (err) {
                res.status(500).send({ message: `Error al borrar usuario en la base de datos ${err}` });
            }
            res.status(200).send({ message: 'Usuario ha sido eliminado correctamente' });
        })
    })

}

function updateUser(req, res) {

    // if (!validacion(req.body.email)) return res.status(422).send({ message: `Error al crear el usuario` });
    // if (!validacion(req.body.displayName)) return res.status(422).send({ message: `Error al crear el usuario` });
    // if (!validacion(req.body.password)) return res.status(422).send({ message: `Error al crear el usuario` });

    let userId = req.user;
    let update = req.body;

    update.password = bcrypt.hashSync(req.body.password, salt);

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });
        }
        return res.status(200).send({ user: userUpdated });
    });

}

function addProposeUser(req, res) {
    var idPropose = req.params.idPropose;

    User.findById(req.user).exec((err, user) => {
        if (err) return res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });

        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        Propose.findById(idPropose).exec((err, propose) => {
            if (err) return res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });
            if (!propose) return res.status(404).send({ message: 'Propuesta no encontrado' });
            if (user.propuestasApoyadas.includes(idPropose)) return res.status(404).send({ message: 'Propuesta ya seleccionada' });

            user.propuestasApoyadas.push(idPropose);

            user.save((err) => {
                if (err) return res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });

                return res.status(201).send(true);
            })
        })

    })
}

function deleteUserPropose(req, res) {
    Propose.findById(req.params.idPropose).exec(function (err, event) {
        if (err) return res.status(400).send({ "error": "Error de DB" });
        if (!event) return res.status(404).send({ error: "Esta propuesta no existe" });

        User.findById(req.user).exec(function (err, user) {

            if (err) return res.status(400).send({ "error": "Error de DB" });
            if (!user) return res.status(404).send({ error: "El usuario no existe" });

            let index = user.propuestasApoyadas.indexOf(req.params.idPropose);
            if (index != -1) {

                user.propuestasApoyadas.splice(index, 1);
                user.save(function (err, event) {

                    if (err) {
                        return res.status(400).send({ "error": "Error de DB" });
                    }
                    return res.status(200).send({ succes: true });
                });
            } else {
                return res.status(403).send({ error: "Propuesta no apoyada" });
            }
        })
    });
}

function validacion(campo) {
    if (campo == null || campo == '') {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    signUp,
    signIn,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    addProposeUser,
    deleteUserPropose
}

