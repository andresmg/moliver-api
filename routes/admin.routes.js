const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const adminController = require("../controllers/admin.controller")

module.exports = router

//User controller
router.get("/biopsies",
    authMiddleware.isAuthenticated,
    adminController.getAllbiopsies
)

router.get('/patients',
    authMiddleware.isAuthenticated,
    adminController.getAllPatients
)