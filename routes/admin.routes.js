const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const adminController = require("../controllers/admin.controller")

module.exports = router

//User controller
router.post("/biopsies",
    authMiddleware.isAuthenticated,
    adminController.getAllBiopsies
)

router.get('/patients',
    authMiddleware.isAuthenticated,
    adminController.getAllPatients
)

router.get("/histories/:id",
    authMiddleware.isAuthenticated,
    adminController.getPatientHistories
)

router.post('/add-date',
    authMiddleware.isAuthenticated,
    adminController.createDate
)

router.get('/delete-date/:id',
    authMiddleware.isAuthenticated,
    adminController.deleteDate
)

router.post('/patient/add',
    authMiddleware.isAuthenticated,
    adminController.createPatient
)

router.post('/session',
    adminController.getSession
)