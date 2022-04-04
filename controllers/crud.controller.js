const Tabledata = require('../models/Tabledata.model')

const createError = require('http-errors')
const mongoose = require('mongoose')


module.exports.createData = (req, res, next) => {
  const {data} = req.body

  Tabledata.find({dataName: data[0].dataName})
    .then(reponse => {
      if (reponse.length > 0) {
        res.status(400).json({
          message: 'The data table already exists, please upload a new one.'
        })
      } else {
        data.forEach(unidad => {
          const newItem = new Tabledata({
            dataName: unidad.dataName,
            fecha: unidad.fecha,
            hora: unidad.hora,
            consumo: unidad.consumo,
            precio: unidad.precio,
            coste: unidad.coste
          })
          newItem.save()
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error while creating the data.'
      })
    })

}

module.exports.getData = (req, res, next) => {
  Tabledata.find()
    .then((data) => {
      res.status(201).json(data)
    })
    .catch(next)
}

module.exports.deleteTableRow = (req, res, next) => {
  Tabledata.findByIdAndDelete(req.params.id)
    .then(() => {
      Tabledata.find()
        .then((data) => {
          res.status(201).json(data)
        })
        .catch(next)
    })
    .catch(next)
}

module.exports.updateTableRow = (req, res, next) => {
  const {id, dataName, fecha, hora, consumo, precio, coste} = req.body

  Tabledata.findByIdAndUpdate(id, req.body, {new: true})
    .then(() => {
      Tabledata.find()
        .then(data => {
          res.status(201).json(data)
        })
        .catch(next)
    })
    .catch(next)

}
