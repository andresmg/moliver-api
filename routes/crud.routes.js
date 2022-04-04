const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const crudController = require("../controllers/crud.controller")
const upload = require("../config/cloudinary.config")

module.exports = router

//Crud controller
router.post(
  "/register",
  authMiddleware.isNotAuthenticated,
  crudController.createUser
)

// router.get(
//   "/user/:id",
//   authMiddleware.isAuthenticated,
//   crudController.readUser
// )

// router.get(
//   "/user/:id/delete",
//   authMiddleware.isAuthenticated,
//   crudController.deleteUser
// )

router.patch(
  "/user-profile/:id/edit",
  authMiddleware.isAuthenticated,
  crudController.updateUser
)

router.post(
  "/user-profile/:id/edit-avatar",
  authMiddleware.isAuthenticated,
  upload.single("file"),
  crudController.updateUserAvatar
)

router.post(
  "/update-password/:id",
  authMiddleware.isAuthenticated,
  crudController.updatePassword
)
