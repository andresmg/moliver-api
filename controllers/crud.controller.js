const User = require('../models/User.model')

const createError = require('http-errors')
const bcryptjs = require('bcryptjs')
const saltRounds = 10
const mongoose = require('mongoose')
const nodemailer = require('../config/mailer.config')

module.exports.createUser = (req, res, next) => {
  const {email, password, name, dni} = req.body

  if (!email || !password || !name || !dni) {
    throw createError(400, 'Todos los campos son obligatorios. Por favor ingresa tu nombre, correo, cédula y contraseña.')
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

  if (!regex.test(password)) {
    throw createError(400, 'La contraseña debe tener mínimo 6 caracteres y debe contener al menos un número y una letra mayúscula.')
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then(() => {
      return User.create({
        name,
        email,
        password,
        dni
      })
    })
    .then((user) => {
      nodemailer.sendValidationEmail(
        user.email,
        user.activation.token,
        user.name
      )
      res.json({
        message: 'Revisa tu correo para activar tu cuenta.',
        token: user.activation.token
      })
      throw ('El usuario ya ha sido activado.')
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.json({error: error.errors})
      } else if (error.code === 11000) {
        throw createError(400, 'El correo ya está registrado.')
      } else {
        next(error)
      }
    })
    .catch(next)
}

module.exports.deleteUser = (req, res, next) => {
  const id = req.params.id
  const userId = req.session.user.id

  if (id === userId) {
    User.findByIdAndDelete(id)
      .then(() => {
        req.session.destroy()
        res.status(204).json({message: 'Usuario eliminado exitosamente.'})
      })
      .catch(next)
  } else {
    return res
      .status(403)
      .json({message: "No posees los privilegios necesarios para eliminar este usuario."})
  }
}

module.exports.readUser = (req, res, next) => {
  const id = req.params.id
  const userId = req.session.user.id

  User.findById(id)
    .then((user) => {
      if (userId === id) {
        res.status(201).json({
          user,
          message: `Perfil de ${user.name}`
        })
      } else {
        req.session.destroy()
        res.status(204).json({
          message: `No tienes los privilegios necesarios para realizar esta tarea.`
        })
      }
    })
    .catch((error) => next(error))
}

module.exports.updateUser = (req, res, next) => {
  const {id} = req.params
  const {name, address, phone, city, zipcode, age, birthdate, sex} = req.body

  User.findByIdAndUpdate(id, req.body, {new: true})
    .then(updatedUser => {
      res.status(201).json(updatedUser)
    })
    .catch(error => next(createError(400, error)))

}

module.exports.updateUserAvatar = (req, res, next) => {
  const {id} = req.params

  req.body.fd = req.file ? req.file.filename : 'https://res.cloudinary.com/dutvbml2i/image/upload/v1607677904/moliver/foto-perfil.jpg'

  return User.findByIdAndUpdate(id, {
    avatar: `${process.env.CLOUDINARY_SECURE}/${req.file.originalname}`
  }, {new: true})
    .then((updatedAvatar) => {
      res.status(201).json(updatedAvatar)
    })
    .catch((error) => next(error))
}

module.exports.updatePassword = (req, res, next) => {
  const id = req.params.id
  const userPass = req.session.user.password

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

  if (!regex.test(req.body.newpassword)) {
    throw createError(400, 'La contraseña debe tener mínimo 6 caracteres y debe contener al menos un número y una letra mayúscula.')
  }
  bcryptjs
    .compare(req.body.password, userPass)
    .then((match) => {
      if (match) {
        bcryptjs
          .genSalt(saltRounds)
          .then((salt) => bcryptjs.hash(req.body.newpassword, salt))
          .then((newHashedPassword) => {
            return User.findByIdAndUpdate(id, {
              password: newHashedPassword,
              new: true
            })
          })
          .then(updatedPass => res.status(201).json(updatedPass))
          .catch(error => next(createError(400, error)))
      } else {
        throw createError(400, 'La contraseña actual es inválida.')
      }
    })
    .catch(error => next(createError(400, error)))
}




