const mongoose = require("mongoose")

const User = require("../models/User.model")
const Biopsy = require("../models/Biopsy.model")
const createError = require("http-errors")

const nodemailer = require("../config/mailer.config")

module.exports.index = (req, res, next) => {
  res.json({title: "Welcome to Moliver!"})
}

module.exports.doLogin = (req, res, next) => {
  const {email, password} = req.body

  if (!email || !password) {
    throw createError(400, "Ingresa tu usuario y/o contraseña")
  }

  User.findOne({email: email})
    .populate('biopsies')
    .populate({
      path: "biopsies",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .then((user) => {
      if (!user) {
        throw createError(404, "Usuario no encontrado, por favor, intenta nuevamente")
      } else if (user.role === "Temporary") {
        console.log(`ESTE USUARIO TIENE QUE CAMBIAR SU CLAVE`)
        return user
          .checkPassword(password)
          .then((match) => {
            if (!match) {
              throw createError(400, "Error de usuario y/o contraseña")
            } else {
              req.session.user = user
              if (user.role === "Guest") {
                res.status(201).json(user)
              } else if (user.role === "Admin") {
                res.status(201).json(user)
              } else if (user.role === "Temporary") {
                res.status(201).json(user)
              }
            }
          })
          .catch(next)
      } else if (user.activation.active === false) {
        throw createError(404, "Tu cuenta no ha sido activada, por favor, revisa tu correo.")
      } else {
        return user
          .checkPassword(password)
          .then((match) => {
            if (!match) {
              throw createError(400, "Error de usuario y/o contraseña")
            } else {
              req.session.user = user
              if (user.role === "Guest") {
                res.status(201).json(user)
              } else if (user.role === "Admin") {
                res.status(201).json(user)
              }
            }
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({"activation.token": req.params.token})
    .then((user) => {
      if (user) {
        if (user.activation.active === true) {
          throw createError(401, "Tu cuenta ya está activada.")
        } else {
          user.activation.active = true
          user
            .save()
            .then((user) => {
              res
                .status(201)
                .json({message: `¡${user.name}, tu cuenta ha sido activada!`})
            })
            .catch(next)
        }
      } else {
        throw createError(400, "¡Oops! error en el link usado.")
      }
    })
    .catch(next)
}


module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json({message: "¡Hasta luego! ¡regresa pronto!"})
}