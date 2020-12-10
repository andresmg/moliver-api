// const createError = require('http-errors')
const disciplines = require('../data/disciplines')
const services = require('../data/services')
const User = require('../models/User.model')
const Reservations = require('../models/Reservations.model')
const Lesson = require('../models/Lesson.model')
const Social = require('../models/Social.model')
const Gym = require("../models/Gimnasium.model")
const Instructor = require("../models/Instructor.model")
const Waitinglist = require("../models/Waitinglist.model")

module.exports.getDisciplines = (req, res, next) => {
  const disciplinesArr = []

  disciplinesArr.push(disciplines.map(el => el.name))

  res.json(disciplinesArr)
}

module.exports.getServices = (req, res, next) => {
  const servicesArr = []

  servicesArr.push(services.map(el => el.name))

  res.json(servicesArr)
}

module.exports.getOngs = (req, res, next) => {
  Social.find()
    .then((result) => res.status(201).json(result))
    .catch((error) => next(error))
}


module.exports.getAllData = (req, res, next) => {
  const users = User.find({role: "Guest"})
  const gyms = Gym.find()
    .populate('user')
  const instructors = Instructor.find()
    .populate('user')
  const lessons = Lesson.find()
    .populate('gym')
    .populate({
      path: "gym",
      populate: {
        path: "user",
        model: "User",
      }
    })
    .populate('instructor')
    .populate({
      path: "instructor",
      populate: {
        path: "user",
        model: "User",
      }
    })
  const reservations = Reservations.find()
    .populate('user')
    .populate("lesson")
    .populate({
      path: "lesson",
      populate: {
        path: "gym",
        model: "Gym",
        populate: {
          path: "user",
          model: "User",
        }
      },
    })
  const orgs = Social.find()

  Promise.all([users, gyms, instructors, lessons, reservations, orgs])
    .then((result) => res.status(201).json(result))
    .catch((error) => next(error))
}

module.exports.earnedPoints = async (req, res, next) => {
  const socialId = req.params.id
  const {id, lessonId} = req.body
  const userId = req.session.user.id

  Reservations.findOneAndUpdate({lesson: lessonId},
    {
      $inc: {points: -10}
    },
    {new: true}
  )
    .then(() => console.log('reservation updated'))
    .catch((error) => next(error))

  const social = await Social.findByIdAndUpdate(socialId,
    {
      $inc: {points: +10}
    },
    {new: true}
  )

  const user = await User.findById(userId)
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

  Promise.all([social, user])
    .then(updatedInfo => {
      res.status(201).json(updatedInfo)
    })
    .catch(error => next(createError(400, error)))
}