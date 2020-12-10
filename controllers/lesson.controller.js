const User = require("../models/User.model")
const Gym = require("../models/Gimnasium.model")
const Instructor = require("../models/Instructor.model")
const Lesson = require("../models/Lesson.model")
const Reservations = require("../models/Reservations.model")
const createError = require("http-errors")
const mongoose = require("mongoose")
const nodemailer = require("../config/mailer.config")

module.exports.createLesson = async (req, res, next) => {

  const userId = req.session.user.id

  const {
    name,
    address,
    zipcode,
    city,
    discipline,
    date,
    duration,
    details,
    capacity,
    instructor,
    gym,
    classroom
  } = req.body

  if (
    !name ||
    !address ||
    !zipcode ||
    !city ||
    !date ||
    !duration ||
    !capacity
  ) {
    return res
      .status(400)
      .json({message: "All fields are mandatory. Please provide your name, address, zipcode, city, date, duration and capacity."})
  }

  // this check if the instructor is workind at that time, import instructor from frontend.
  const allLessons = await Lesson.find()
  const lessonAtSameTime = allLessons.filter(
    (lesson) => lesson.date.setSeconds(0, 0) == new Date(date).setSeconds(0, 0)
  )
  const instructorWorking = lessonAtSameTime.filter(
    (lesson) => lesson.instructor == instructor
  )

  if (instructorWorking.length) {
    return res
      .status(409)
      .json({message: "Instructor already working at this time"})
  } else if (classroom.length == 0) {
    Lesson.create({
      name,
      address,
      zipcode,
      city,
      discipline,
      date,
      duration,
      details,
      capacity,
      instructor,
      gym
    })
      .then((newLesson) => {
        res.status(201).json(newLesson)
      })
      .catch((error) => error)
  } else {
    Lesson.create({
      name,
      address,
      zipcode,
      city,
      discipline,
      date,
      duration,
      details,
      capacity,
      instructor,
      gym,
      classroom
    })
      .then((newLesson) => {
        res.status(201).json(newLesson)
      })
      .catch((error) => error)
  }
}

module.exports.getLessonGuests = (req, res, next) => {
  const lessonId = req.params.id

  Reservations.find({lesson: lessonId})
    .populate('user')
    .then((guests) => res.status(201).json(guests))
    .catch((error) => next(error))
}

module.exports.getAllLessons = (req, res, next) => {
  Lesson.find()
    .populate('classroom')
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
    .then((allLessons) => res.status(201).json(allLessons))
    .catch((error) => next(error))
}

module.exports.getLessonInfo = (req, res, next) => {
  const lessonId = req.params.id

  const allBookings = Reservations.find({lesson: lessonId}).populate("user")

  const lessonInfo = Lesson.findById(lessonId)
    .populate("user")
    .populate("gym")
    .populate({
      path: "gym",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate("classroom")
    .populate("instructor")
    .populate({
      path: "instructor",
      populate: {
        path: "user",
        model: "User",
      },
    })

  Promise.all([allBookings, lessonInfo])
    .then((lesson) => {
      res.status(201).json(lesson)
    })
    .catch((error) => next(createError(400, error)))
}

module.exports.updateLesson = async (req, res, next) => {
  const {id} = req.params
  const {
    name,
    address,
    zipcode,
    city,
    discipline,
    date,
    duration,
    details,
    capacity,
    instructor,
    gym,
    classroom
  } = req.body
  const userId = req.session.user.id

  // this check if the instructor is workind at that time, import instructor from frontend.

  const lessonInfo = await Lesson.findById(id)
  const gymUser = await Gym.findById(lessonInfo.gym)
  const allLessons = await Lesson.find()


  const lessonAtSameTime = allLessons.filter(
    (lesson) => lesson.date.setSeconds(0, 0) == new Date(date).setSeconds(0, 0)
  )
  const instructorWorking = lessonAtSameTime.filter(
    (lesson) => lesson.instructor == instructor
  )

  const instructorsToTakeInCount = instructorWorking.filter(
    (lesson) => lesson.id !== id
  )

  if (instructorsToTakeInCount.length) {
    return res
      .status(409)
      .json({message: "Instructor already working at this time"})
  }

  if (userId == gymUser.user || req.session.user.role == "Admin") {
    Lesson.findByIdAndUpdate(id, req.body, {new: true})
      .then((updatedLesson) => {
        res.status(201).json(updatedLesson)
      })
      .catch((error) => next(createError(400, error)))
  } else {
    req.session.destroy()
    res.status(204).json()
  }
}

module.exports.deleteLesson = async (req, res, next) => {
  const {id} = req.params
  const userId = req.session.user.id

  const lesson = await Lesson.findById(id)
  const gym = await Gym.findById(lesson.gym)

  if (lesson.user.length) {
    // Just to delete simulate lessons from seeds
    if (gym.id == lesson.gym) {
      return Lesson.findByIdAndDelete(id)
        .then(() => {
          res.status(204).json({message: "Lesson deleted succesfully"})
        })
        .catch(next)
    } else {
      return res
        .status(409)
        .json({message: "This lesson already has sales, is not posible to delete"})
    }
  }


  if (gym.user == userId) {
    Lesson.findByIdAndDelete(id)
      .then(() => {
        res.status(204).json({message: "Lesson deleted succesfully"})
      })
      .catch(next)
  } else {
    return res
      .status(403)
      .json({message: "Don't have enough privileges to perfom this task"})
  }
}
