const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const dataController = require("../controllers/data.controller")

module.exports = router

router.get("/disciplines", authMiddleware.isAuthenticated, dataController.getDisciplines)

router.get("/services", authMiddleware.isAuthenticated, dataController.getServices)

router.get("/ongs", authMiddleware.isAuthenticated, dataController.getOngs)

router.get("/alldata", authMiddleware.isAuthenticated, dataController.getAllData)

router.post('/addpoints/:id', authMiddleware.isAuthenticated, dataController.earnedPoints)

