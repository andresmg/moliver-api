const mongoose = require("mongoose")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const createError = require("http-errors")


module.exports.getAllbiopsies = (req, res, next) => {
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        Biopsy.find()
            .populate("user")
            .sort({updatedAt: -1})
            .then((biopsies) => {
                res.status(201).json(biopsies)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: "¡No tiene suficientes privilegios para realizar esta acción!"})
    }
}

module.exports.getAllPatients = (req, res, next) => {
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        User.find({role: 'Guest'})
            .sort()
            .then(patients => {
                res.status(201).json(patients)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: "¡No tiene suficientes privilegios para realizar esta acción!"})
    }
}