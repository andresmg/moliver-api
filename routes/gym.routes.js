const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const gymController = require("../controllers/gym.controller")

module.exports = router

router.get('/gyms',
  authMiddleware.isAuthenticated,
  gymController.getGyms)

router.get('/gym-detail/:id',
  authMiddleware.isAuthenticated,
  gymController.getSingleGym)

router.get('/gym-classrooms/:id',
  authMiddleware.isAuthenticated,
  gymController.getGymClassrooms)

router.get('/gym-lessons/:id',
  authMiddleware.isAuthenticated,
  gymController.getGymLessons)
