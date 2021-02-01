const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const biopsyController = require("../controllers/biopsy.controller")

module.exports = router

//Biopsy controller
router.get("/biopsy/:id/delete", 
authMiddleware.isAuthenticated, 
biopsyController.dropBiopsy
)