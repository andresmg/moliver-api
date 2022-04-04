const express = require("express")
const router = express.Router()
const crudController = require("../controllers/crud.controller")

module.exports = router

//Crud controller
router.post("/uploaddata", crudController.createData)
router.get("/getdata", crudController.getData)
router.get('/deleteitem/:id', crudController.deleteTableRow)
router.patch('/updateitem', crudController.updateTableRow)