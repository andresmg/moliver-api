const User = require("../models/User.model")
const Gym = require("../models/Gimnasium.model")
const Instructor = require("../models/Instructor.model")
const Lesson = require("../models/Lesson.model")
const Classroom = require("../models/Classroom.model")
const Reservations = require("../models/Reservations.model")
const createError = require("http-errors")
const mongoose = require("mongoose")
const nodemailer = require("../config/mailer.config")

module.exports.createClassroom = async (req, res, next) => {

  const userId = req.session.user.id
  const {
    user,
    gym,
    name,
    rows,
    discipline
  } = req.body

  if (
    !name ||
    !gym ||
    !user ||
    !rows ||
    !discipline
  ) {
    return res
    .status(400)
    .json({message: "All fields are mandatory. Please provide your name, rows and discipline."}) 
  }

  // this check if the classroom name is picked.
  const allClassrooms = await Classroom.find()
  const sameClassroomName = allClassrooms.filter(
    (classroom) => classroom.name == name
  )
  const classroomNamePicked = sameClassroomName.filter(
    (classroom) => classroom.gym == gym
  )

  if (classroomNamePicked.length) {
    return res
    .status(409)
    .json({message: "classroom already picked" }) 
  }
  else if (userId == user) {
    return Classroom.create({
      user,
      gym,
      name,
      rows,
      discipline
    })
      .then(newClassroom => {res.status(201).json({newClassroom, message: `Check your classroom ${newClassroom.name}`})})
      .catch((error) => error)
  }
}

module.exports.getClassroomInfo = (req, res, next) => {
  const classroomId = req.params.id

  const classroomInfo = Classroom.findById(classroomId)
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
  Promise.all([classroomInfo])
    .then((classroom) => {
      res.status(201).json(classroom)
    })
    .catch((error) => next(createError(400, error)))
}

module.exports.updateClassroom = async (req, res, next) => {
  const {id} = req.params
  const {
    name,
    rows,
    discipline
  } = req.body

  const userId = req.session.user.id

  // this check if the classroom name is picked.
  const allClassrooms = await Classroom.find()
  const sameClassroomName = allClassrooms.filter(
    (classroom) => classroom.name == name
  )
  const classroomNamePicked = sameClassroomName.filter(
    (classroom) => classroom.gym == gym
  )

  const classroom = await Classroom.findById(id)

  if (classroomNamePicked.length) {
    return res
    .status(409)
    .json({message: "classroom already picked" }) 
  }

  if (userId == classroom.user) {
    Classroom.findByIdAndUpdate(id, req.body, {new: true})
      .then((updatedClassroom) => {
        res.status(201).json(updatedClassroom)
      })
      .catch((error) => next(createError(400, error)))
  } else {
    req.session.destroy()
    res.status(204).json()
  }
}

module.exports.deleteClassroom = async (req, res, next) => {
  const {id} = req.params
  const userId = req.session.user.id

  const classroom = await Classroom.findById(id)
  const lessons = await Lesson.find()

  const classroomUsed = lessons.filter(
    (lesson) => lesson.gym == id
  )

  if (classroomUsed.length) {
    return res
    .status(409)
    .json({message: "This classroom is already in use, is not posible to delete" }) 
  }

  if (classroom.user == userId) {
    Classroom.findByIdAndDelete(id)
      .then(() => {
        res.status(204).json({message: "Classroom deleted succesfully"})
      })
      .catch(next)
  } else {
    return res
    .status(403)
    .json({message: "Don't have enough privileges to perfom this task" }) 
  }
}

module.exports.getClassroomLessons = (req, res, next) => {
  const {id} = req.params

  Lesson.find({classroom: id})
    .populate('user')
    .populate('instructor')
    .populate({
      path: "instructor",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate('classroom')
    .then((lessons) => res.status(201).json(lessons))
    .catch(next)
}
