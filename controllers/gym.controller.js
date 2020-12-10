const Gym = require("../models/Gimnasium.model")
const Lesson = require("../models/Lesson.model")
const Classroom = require("../models/Classroom.model")

module.exports.getGyms = (req, res, next) => {
  Gym.find()
    .populate("user")
    .sort({date: 1})
    .then((gyms) => {
      res.status(201).json(gyms)
    })
    .catch(next)
}

module.exports.getSingleGym = (req, res, next) => {
  Lesson.find({gym: req.params.id})
    .populate("instructor")
    .populate({
      path: "instructor",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate("user")
    .sort({date: 1})
    .then((gym) => {
      res.status(201).json(gym)
    })
    .catch(next)
}

module.exports.getGymClassrooms = (req, res, next) => {
  Classroom.find({gym: req.params.id})
    .populate("user")
    .then((classrooms) => {
      res.status(201).json(classrooms)
    })
    .catch(next)
}

module.exports.getGymLessons = (req, res, next) => {
  Lesson.find({gym: req.params.id})
    .populate("user")
    .populate("instructor")
    .populate({
      path: "instructor",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate('classroom')
    .sort({date: 1})
    .then((lessons) => {
      res.status(201).json(lessons)
    })
    .catch(next)
}
