const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const instructorController = require("../controllers/instructor.controller")

module.exports = router

router.get('/instructors',
  authMiddleware.isAuthenticated,
  instructorController.getInstructors)

router.get('/instructor-lessons/:id',
  authMiddleware.isAuthenticated,
  instructorController.getInstructorLessons)

router.post('/instructor-detail',
  authMiddleware.isAuthenticated,
  instructorController.getInstructorInfo)