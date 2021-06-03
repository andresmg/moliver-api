const mongoose = require('mongoose')

const User = require('../models/User.model')
const Biopsy = require('../models/Biopsy.model')
const createError = require('http-errors')
const History = require('../models/History.model')


module.exports.getAllBiopsies = (req, res, next) => {
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        Biopsy.find()
            .populate('user')
            .sort({updatedAt: -1})
            .then((biopsies) => {
                res.status(201).json(biopsies)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: '¡No tiene suficientes privilegios para realizar esta acción!'})
    }
}

module.exports.getAllPatients = (req, res, next) => {
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        User.find({role: {$ne: 'Admin'}})
            .sort({name: 1})
            .then(patients => {
                res.status(201).json(patients)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: '¡No tiene suficientes privilegios para realizar esta acción!'})
    }
}

module.exports.getPatientHistories = (req, res, next) => {
    const userRole = req.session.user.role
    const id = req.params.id

    if (userRole === 'Admin') {
        History.find({user: id})
            .populate('user')
            .sort({updatedAt: -1})
            .then((histories) => {
                res.status(201).json(histories)
            })
            .catch(next)
    } else {
        req.session.destroy()
        res.status(204).json({message: '¡No tiene suficientes privilegios para realizar esta acción!'})
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

module.exports.createPatient = (req, res, next) => {
    const userRole = req.session.user.role

    const formatDate = (d) => {
        var str = d
        darr = str.split('/')
        return new Date(parseInt(darr[2]), parseInt(darr[1]) - 1, parseInt(darr[0]))
    }

    const {name, email, dni, address, zipcode, city, phone, birthdate, sex, insurance_carrier, marital_status} = req.body

    const userInfo = {
        name, email, dni, address, zipcode, city, phone, birthdate: formatDate(birthdate), sex, insurance_carrier, marital_status, password: 'Paciente123'
    }

    console.log(userRole)
    console.log(req.body)

    if (userRole === 'Admin') {
        User.find({dni: dni})
            .then(user => {
                if (user.length && user[0].email === email) {
                    console.log(`el usuario existe`)
                    res.status(204).json({message: 'Ya existe el paciente en la base de datos'})
                } else if (user.length && user[0].email.includes('provicional')) {
                    User.findByIdAndUpdate(user[0].id, userInfo, {new: true})
                        .then((newPatient) => {
                            res.status(201).json(newPatient)
                        })
                        .catch(error => next(createError(400, error)))
                } else {
                    console.log('no existe este usuario')
                    User.create({
                        name,
                        email,
                        dni,
                        address,
                        zipcode,
                        city,
                        phone,
                        birthdate: formatDate(birthdate),
                        sex,
                        insurance_carrier,
                        marital_status,
                        password: 'Paciente123',
                        role: 'Temporary',
                        activation: {
                            active: true
                        }
                    })
                        .then((newPatient) => {
                            res.status(201).json(newPatient)
                        })
                        .catch(error => next(createError(400, error)))
                }
            })
            .catch(error => next(createError(400, error)))
    } else {
        return res
            .status(403)
            .json({message: 'No posee suficiente privilegios para hacer esta tarea'})
    }
}