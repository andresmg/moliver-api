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
        .catch(next)
}