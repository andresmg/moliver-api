const mongoose = require("mongoose")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const BiopsyNumber = require("../models/BiopsyNumber.model")
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

module.exports.addBiopsy = (req, res, next) => {
    const userRole = req.session.user.role
    const {clinic_diagnosis, diagnostics, dni, material, name, reference, report} = req.body

    const months = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    const getDay = new Date().getDate()

    const createBiopsy = (b, u) => {
        Biopsy.create({
            user: u[0].id,
            number: `${months[new Date().getMonth()]} - ${b.number} - ${new Date().getFullYear()}`,
            clinic_diagnosis,
            diagnostics,
            dni,
            material,
            name,
            reference,
            report
        })
            .then((newBiopsy) => {
                res.status(201).json(newBiopsy)
            })
            .catch(e => console.log(e))
    }

    User.find({dni: dni})
        .then(user => {
            if (!user) {
                User.create({
                    name: name,
                    email: "provicional@gmail.com",
                    password: "Moliver123",
                    dni: dni,
                    role: 'Guest'
                })
            }
        })
        .catch(e => console.log(e))

    if (userRole === 'Admin') {
        if (getDay == 1) {
            BiopsyNumber.find()
                .then(b => {
                    if (new Date(b[0].updatedAt).getMonth() < new Date().getMonth()) {
                        BiopsyNumber.find()
                            .then(b => {
                                BiopsyNumber.findByIdAndUpdate(b[0].id, {number: 1}, {new: true})
                                    .then(b => {
                                        User.find({dni: dni})
                                            .then(user => {
                                                createBiopsy(b, user)
                                            })
                                            .catch(e => console.log(e))
                                    })
                                    .catch(e => console.log(e))
                            })
                            .catch(e => console.log(e))
                    } else {
                        BiopsyNumber.find()
                            .then(b => {
                                BiopsyNumber.findByIdAndUpdate(b[0].id, {$inc: {number: +1}}, {new: true})
                                    .then(b => {
                                        User.find({dni: dni})
                                            .then(user => {
                                                createBiopsy(b, user)
                                            })
                                            .catch(e => console.log(e))
                                    })
                                    .catch(e => console.log(e))
                            })
                            .catch(e => console.log(e))
                    }
                })
                .catch(e => console.log(e))
        } else {
            BiopsyNumber.find()
                .then(b => {
                    BiopsyNumber.findByIdAndUpdate(b[0].id,
                        {
                            $inc: {number: +1}
                        },
                        {new: true})
                        .then(b => {
                            User.find({dni: dni})
                                .then(user => {
                                    createBiopsy(b, user)
                                })
                                .catch(e => console.log(e))
                        })
                        .catch(e => console.log(e))
                })
                .catch(e => console.log(e))
        }
    } else {
        return res
            .status(403)
            .json({message: "No posee suficiente privilegios para hacer esta tarea"})
    }
}