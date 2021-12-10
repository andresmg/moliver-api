const mongoose = require('mongoose')

const User = require('../models/User.model')
const Blog = require('../models/Blog.model')
const createError = require('http-errors')


module.exports.getAllBlogs = (req, res, next) => {

    Blog.find()
        .populate('authorId')
        .sort({updatedAt: -1})
        .then(blogs => {
            res.status(201).json(blogs)
        })
        .catch(error => next(createError(400, error)))
}

module.exports.createBlog = (req, res, next) => {
    const {data} = req.body

    Blog.create({
        title: data.title,
        content: data.content,
        authorId: data.id,
        picPath: data.picPath
    })
        .then((newBlog) => {
            res.status(201).json(newBlog)
        })
        .catch(error => next(createError(400, error)))
}

module.exports.deleteBlog = (req, res, next) => {
    const id = req.params.id
    const userRole = req.session.user.role

    if (userRole === 'Admin') {
        Blog.findByIdAndDelete(id)
            .then(() => {
                res.status(200).json({message: 'Blog deleted'})
            })
            .catch(error => next(createError(400, error)))
    } else {
        req.session.destroy()
        res.status(204).json({message: '¡No tiene suficientes privilegios para realizar esta acción!'})
    }
}