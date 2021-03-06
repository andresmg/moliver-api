
const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  api_url: process.env.CLOUDINARY_URL
})

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'moliver', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png', 'svg']
  ,
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.').slice(0, -1).join('.')) // The file on cloudinary would have the same name as the original file name
  }
})

const uploadCloud = multer({storage: storage})

module.exports = uploadCloud
