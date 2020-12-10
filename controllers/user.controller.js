const mongoose = require("mongoose")

const User = require("../models/User.model")
const createError = require("http-errors")

const nodemailer = require("../config/mailer.config")

module.exports.index = (req, res, next) => {
  res.json({title: "Welcome to Moliver!"})
}

module.exports.doLogin = (req, res, next) => {
  const {email, password} = req.body

  if (!email || !password) {
    throw createError(400, "Missing credentials")
  }

  User.findOne({email: email})
    .then((user) => {
      if (!user) {
        throw createError(404, "User not found, please try again")
      } else if (user.activation.active === false) {
        throw createError(404, "User is not active, please check your email")
      } else {
        return user
          .checkPassword(password)
          .then((match) => {
            if (!match) {
              throw createError(400, "Invalid password, please try again")
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
          throw createError(401, "User is already active")
        } else {
          user.activation.active = true
          user
            .save()
            .then((user) => {
              res
                .status(201)
                .json({message: `${user.name}'s account has been activated`})
            })
            .catch(next)
        }
      } else {
        throw createError(400, "Oops! invalid token")
      }
    })
    .catch(next)
}


module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json({message: "Bye! Come back soon!"})
}