const mongoose = require("mongoose")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const createError = require("http-errors")


module.exports.getAllbiopsies = (req, res, next) => {
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        Biopsy.find()
            .populate("user")
            .sort({date: 1})
            .then((biopsies) => {
                res.status(201).json(biopsies)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: "¡No tiene suficientes privilegios para realizar esta acción!"})
    }
}