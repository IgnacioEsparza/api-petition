'use strict'

const User = require('../models/user')
const service = require('../services')

const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')



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
    console.log(req.body);
    User.findOne({ email: req.body.email }).select('+password').exec(function (err, user) {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: 'No existe el usuario' })

        //console.log('Body : ' + req.body.password + ' Mongo: ' + user.password)

        bcrypt.compare(req.body.password, user.password, function (err, decrypt) {
            if (err) return res.status(500).send({ message: err })

            if (decrypt) {
                req.user = user
                res.status(200).send({
                    message: 'Logueado correctamente',
                    token: service.createToken(user)
                })

            }
        })
    })
}

module.exports = {
    signUp,
    signIn
}

