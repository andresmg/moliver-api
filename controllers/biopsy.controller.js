const mongoose = require("mongoose")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const createError = require("http-errors")


module.exports.dropBiopsy = (req, res, next) => {
    const id = req.params.id
    const userRole = req.session.user.role
  
    if (userRole === 'Admin') {
      Biopsy.findByIdAndDelete(id)
        .then(() => {
          res.status(204).json({message: 'La biopsia fue eliminada.'})
        })
        .catch(next)
    } else {
      return res
        .status(403)
        .json({message: "No posee suficiente privilegios para hacer esta tarea"})
    }
  }