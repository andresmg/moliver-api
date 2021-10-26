const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const blogController = require("../controllers/blog.controller")

module.exports = router

//User controller
router.get("/blogs",
    authMiddleware.isNotAuthenticated,
    blogController.getAllBlogs
)
