const Instructor = require('../models/Instructor.model')
const Lesson = require('../models/Lesson.model')

module.exports.getInstructors = (req, res, next) => {
  Instructor.find()
    .populate('user')
    .then((instructors) => {
      res.status(201).json(instructors)
    })
    .catch(next)
}

module.exports.getInstructorLessons = (req, res, next) => {
  const id = req.params.id

  Lesson.find({instructor: id})
    .populate('user')
    .populate('gym')
    .populate({
      path: "gym",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate('classroom')
    .then((lessons) => {
      res.status(201).json(lessons)
    })
    .catch(next)
}

module.exports.getInstructorInfo = async (req, res, next) => {

  const {id} = req.body

  const instructorData = await Instructor.findById(id)
    .populate('user')

  const instructorLessons = await Lesson.find({instructor: id})
    .populate('gym')
    .populate('classroom')

  Promise.all([instructorData, instructorLessons])
    .then((instructor) => {
      res.status(201).json(instructor)
    })
    .catch(next)
}