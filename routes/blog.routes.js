const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")
const blogController = require("../controllers/blog.controller")

module.exports = router

//User controller
router.get("/blogs",
    blogController.getAllBlogs
)

router.post("/blogs/add",
    authMiddleware.isAuthenticated,
    blogController.createBlog
)
