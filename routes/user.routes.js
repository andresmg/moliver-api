const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

module.exports = router

//User controller
router.get("/", userController.index)

router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  userController.doLogin
)

router.post("/logout", authMiddleware.isAuthenticated, userController.logout)

router.get(
  "/activate/:token",
  authMiddleware.isNotAuthenticated,
  userController.activateUser
)