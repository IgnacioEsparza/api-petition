'use strict'

const bodyParser = require('body-parser');

const Propuesta = require('../models/propuesta')

function getPropuesta(req, res) {

    let propuestaId = req.params.propuestaId;

    Propuesta.findById(propuestaId, (err, propuesta) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición ${err}` });
        }
        if (!propuesta) {
            return res.status(404).send({ message: `Propuesta inexistente` });
        }

        res.status(200).send({ propuesta: propuesta });
    })

}

function getPropuestas(req, res) {

    Propuesta.find({}, (err, propuestas) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la petición ${err}` });
        }

        if (!propuestas) {
            return res.status(404).send({ message: `No existen Propuestas` });
        }

        res.status(200).send({ propuestas: propuestas })
    })

}

function updatePropuesta(req, res) {

    let propuestaId = req.params.propuestaId;
    let update = req.body;

    Propuesta.findByIdAndUpdate(propuestaId, update, (err, propuestaUpdated) => {
        if (err) {
            res.status(500).send({ message: `Error al actualizar producto en la base de datos ${err}` });
        }
        res.status(200).send({ propuesta: propuestaUpdated });
    });

}

function deletePropuesta(req, res) {

    let propuestaId = req.params.propuestaId;

    Propuesta.findById(propuestaId, (err, propuesta) => {
        if (err) {
            res.status(500).send({ message: `Error al borrar producto en la base de datos ${err}` });
        }

        propuesta.remove(err => {
            if (err) {
                res.status(500).send({ message: `Error al borrar producto en la base de datos ${err}` });
            }
            res.status(200).send({ message: 'Producto ha sido eliminado correctamente' });
        })
    })

}

function savePropuesta(req, res) {

    console.log('POST /api/propuesta')
    console.log(req.body)

    let propuesta = new Propuesta()
    propuesta.title = req.body.title;
    propuesta.categoria = req.body.categoria;
    propuesta.descripcion = req.body.descripcion;
    propuesta.imagen = req.body.imagen;
    propuesta.icon = req.body.icon;
    propuesta.fecha = req.body.fecha;

    propuesta.save((err, propuestaStored) => {
        if (err) {
            res.status(500).send({ message: `Error al guardar en la base de datos ${err}` });
        }

        res.status(200).send({ propuesta: propuestaStored });
    })
}

module.exports = {
    getPropuesta,
    getPropuestas,
    updatePropuesta,
    deletePropuesta,
    savePropuesta
}