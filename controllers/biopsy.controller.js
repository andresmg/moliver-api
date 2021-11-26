const mongoose = require("mongoose")
const createError = require("http-errors")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const BiopsyNumber = require("../models/BiopsyNumber.model")

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


module.exports.updateBiopsy = (req, res, next) => {
    const id = req.params.id
    const userRole = req.session.user.role
    const data = req.body.data

    if (userRole === 'Admin') {
        Biopsy.findByIdAndUpdate(id, data, {new: true})
            .then((data) => {
                res.status(201).json(data)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: '¡No tiene suficientes privilegios para realizar esta acción!'})
    }
}

module.exports.addBiopsy = (req, res, next) => {
    const userRole = req.session.user.role
    const {clinic_diagnosis, diagnostics, dni, material, name, reference, report} = req.body

    const months = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'

    const emailer = () => {
        let string = ''
        for (let i = 0; i < 15; i++) {
            string += chars[Math.floor(Math.random() * chars.length)]
        }
        return string
    }

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
                                                if (!user.length) {
                                                    User.create({
                                                        name,
                                                        email: `${emailer()}@provicional.com`,
                                                        password: "Moliver123",
                                                        dni,
                                                        role: 'Guest'
                                                    })
                                                        .then(user => {
                                                            Biopsy.create({
                                                                user: user.id,
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
                                                        })
                                                        .catch(e => console.log(e))
                                                } else {
                                                    createBiopsy(b, user)
                                                }
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
                                                if (!user.length) {
                                                    User.create({
                                                        name,
                                                        email: `${emailer()}@provicional.com`,
                                                        password: "Moliver123",
                                                        dni,
                                                        role: 'Guest'
                                                    })
                                                        .then(user => {
                                                            Biopsy.create({
                                                                user: user.id,
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
                                                        })
                                                        .catch(e => console.log(e))
                                                } else {
                                                    createBiopsy(b, user)
                                                }
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
                                    if (!user.length) {
                                        User.create({
                                            name,
                                            email: `${emailer()}@provicional.com`,
                                            password: "Moliver123",
                                            dni,
                                            role: 'Guest'
                                        })
                                            .then(user => {
                                                Biopsy.create({
                                                    user: user.id,
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
                                            })
                                            .catch(e => console.log(e))
                                    } else {
                                        createBiopsy(b, user)
                                    }
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