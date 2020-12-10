const User = require('../models/User.model')
const Gym = require('../models/Gimnasium.model')
const Instructor = require('../models/Instructor.model')
const createError = require('http-errors')
const bcryptjs = require('bcryptjs')
const saltRounds = 10
const mongoose = require('mongoose')
const nodemailer = require('../config/mailer.config')

module.exports.createUser = (req, res, next) => {
  const {email, password, name, role} = req.body

  if (!email || !password || !name || !role) {
    throw createError(400, 'All fields are mandatory. Please provide your name, email, password, and role.')
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

  User.findOne({email})
    .then(user => {
      if (user) throw createError(409, 'Email already registered')
    })

  if (!regex.test(password)) {
    throw createError(400, 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.')
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then(() => {
      return User.create({
        name,
        email,
        password,
        role
      })
    })
    .then((user) => {
      if (user.role === 'Gym') {
        Gym.create({
          user: user.id
        })
      } else if (user.role === 'Instructor') {
        Instructor.create({
          user: user.id
        })
      }
      nodemailer.sendValidationEmail(
        user.email,
        user.activation.token,
        user.name
      )
      res.json({
        message: 'Check your email for activation',
        token: user.activation.token
      })
      throw ('User activated')
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.json({error: error.errors})
      } else if (error.code === 11000) {
        throw createError(400, error)
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
        res.status(204).json({message: 'User deleted succesfully'})
      })
      .catch(next)
  } else {
    return res
      .status(403)
      .json({message: "Don't have enough privileges to perfom this task"})
  }
}

module.exports.readUser = (req, res, next) => {
  const id = req.params.id
  const userId = req.session.user.id

  User.findById(id)
    .then((user) => {
      if (user.role === 'GYM' && id === userId) {
        Gym.findOne({user: id})
          .populate('user')
          .then(user => {
            res.status(201).json({
              user,
              title: `edit ${user.user.name} profile`
            })
          })
          .catch(next)
      } else if (user.role === 'INSTRUCTOR' && id === userId) {
        Instructor.findOne({user: id})
          .populate('user')
          .then(user => {
            res.status(201).json({
              user,
              title: `edit ${user.user.name}`
            })
          })
          .catch(next)
      } else {
        if (userId === id) {
          res.status(201).json({
            user,
            title: `edit ${user.name} profile`
          })
        } else {
          req.session.destroy()
          res.status(204).json()
        }
      }
    })
    .catch((error) => next(error))
}

module.exports.updateUser = (req, res, next) => {
  const {id} = req.params
  const {name, address, phone, city, zipcode, role, services, quote, disciplines} = req.body

  const gym = Gym.findOneAndUpdate({user: id}, {services: services}, {new: true})

  const instructor = Instructor.findOneAndUpdate({user: id}, {
    disciplines: disciplines,
    quote: quote
  },
    {new: true})

  const user = User.findByIdAndUpdate(id, req.body, {new: true})
    .populate("lessons")
    .populate({
      path: "lessons",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "gym",
        model: "Gym",
        populate: {
          path: "user",
          model: "User",
        },
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "classroom",
        model: "Classroom",
      },
    })
    .populate({
      path: "lessons",
      populate: {
        path: "instructor",
        model: "Instructor",
        populate: {
          path: "user",
          model: "User",
        },
      },
    })
    .populate("reservations")
    .populate({
      path: "reservations",
      populate: {
        path: "lesson",
        model: "Lesson",
      },
    })
    .populate("waitinglists")
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "gym",
          model: "Gym",
        }
      },
    })
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "instructor",
          model: "Instructor",
        }
      },
    })
    .populate({
      path: "waitinglists",
      populate: {
        path: "lesson",
        model: "Lesson",
        populate: {
          path: "classroom",
          model: "Classroom",
        },
      },
    })


  Promise.all([user, gym, instructor])
    .then(updatedUser => {
      res.status(201).json(updatedUser)
    })
    .catch(error => next(createError(400, error)))

}

module.exports.updateUserAvatar = (req, res, next) => {
  const {id} = req.params

  req.body.fd = req.file ? req.file.filename : 'https://res.cloudinary.com/dutvbml2i/image/upload/v1603784830/victs/foto-perfil.jpg'

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
    throw createError(400, 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.')
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
        throw createError(400, 'Current password is invalid')
      }
    })
    .catch(error => next(createError(400, error)))
}




