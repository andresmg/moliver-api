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
            .sort({name: 1})
            .then(patients => {
                res.status(201).json(patients)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: "¡No tiene suficientes privilegios para realizar esta acción!"})
    }
}

module.exports.createDate = (req, res, next) => {
    const {userId, date} = req.body

    User.findByIdAndUpdate(userId, {
        next_date: {
            isDate: true,
            date: date
        },
        new: true
    })
        .then((updatedUser) => {
            res.status(201).json(updatedUser)
        })
        .catch((error) => next(createError(400, error)))

}

module.exports.deleteDate = (req, res, next) => {
    const id = req.params.id

    User.findByIdAndUpdate(id, {
        next_date: {
            isDate: false
        },
        new: true
    })
        .then((u) => {
            console.log(u)
            res.status(201).json(u)
        })
        .catch((error) => next(createError(400, error)))
}