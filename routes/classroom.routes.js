const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const classroomController = require("../controllers/classroom.controller")


module.exports = router

//classroom controller
router.post(
  "/classroom",
  authMiddleware.isAuthenticated,
  classroomController.createClassroom
)

router.get('/classroom/:id',
  authMiddleware.isAuthenticated,
  classroomController.getClassroomInfo)

router.get(
  "/classroom/:id/delete",
  authMiddleware.isAuthenticated,
  classroomController.deleteClassroom
)

router.patch(
  "/classroom/:id/edit",
  authMiddleware.isAuthenticated,
  classroomController.updateClassroom
)

router.get('/classroom-lessons/:id',
  authMiddleware.isAuthenticated,
  classroomController.getClassroomLessons)


