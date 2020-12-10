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

router.post(
  "/stripe/checkout",
  authMiddleware.isAuthenticated,
  userController.stripeCheck
)

router.post(
  "/follow/:id",
  authMiddleware.isAuthenticated,
  userController.follow
)

router.post(
  "/book/:id",
  authMiddleware.isAuthenticated,
  userController.booking
)

router.post(
  "/unbook/:id",
  authMiddleware.isAuthenticated,
  userController.unbooking
)

router.post(
  "/waitinglist/:id",
  authMiddleware.isAuthenticated,
  userController.waitingList
)

router.post(
  "/unwaitinglist/:id",
  authMiddleware.isAuthenticated,
  userController.unWaitingList
)

router.post(
  "/followers-users",
  authMiddleware.isAuthenticated,
  userController.getFollowersUsers
)

router.post("/delete-reservation/:id",
  authMiddleware.isAuthenticated,
  userController.deleteCurrentReservation
)

router.patch(
  "/reservation/:id/edit",
  authMiddleware.isAuthenticated,
  userController.updateReservation
)

router.patch(
  "/org/:id/edit",
  authMiddleware.isAuthenticated,
  userController.updateOrg
)