'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.db, { useCreateIndex: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        return console.log(`Error al conectar con la base de datos ${err}`);
    }
    console.log('Conexión a la base de datos exitosa')

    app.listen(config.port, function () {
        console.log(`API corriendo en el puerto ${config.port}`);
    })
})

