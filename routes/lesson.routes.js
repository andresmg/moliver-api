const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const lessonController = require("../controllers/lesson.controller")


module.exports = router

//lesson controller
router.post(
  "/lesson",
  authMiddleware.isAuthenticated,
  lessonController.createLesson
)

router.get('/lesson/:id',
  authMiddleware.isAuthenticated,
  lessonController.getLessonInfo)

router.patch(
  "/lesson/:id/edit",
  authMiddleware.isAuthenticated,
  lessonController.updateLesson
)

router.get(
  "/lesson/:id/delete",
  authMiddleware.isAuthenticated,
  lessonController.deleteLesson
)

router.get('/lesson-guests/:id',
  authMiddleware.isAuthenticated,
  lessonController.getLessonGuests
)

router.get('/all-lessons',
  authMiddleware.isAuthenticated,
  lessonController.getAllLessons
)


