const {Schema, model} = require('mongoose')
const bcrypt = require("bcrypt")
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const SALT_WORK_FACTOR = 10
const Lesson = require('../models/Lesson.model')
const Reservations = require('../models/Reservations.model')
const Waitinglist = require('../models/Waitinglist.model')

const generateRandomToken = () => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
  },
  avatar: {
    type: String,
  },
  address: {
    type: String,
    trim: true
  },
  zipcode: {
    type: Number,
  },
  city: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  packages: {
    type: Number,
    default: 0
  },
  following: {
    type: [String],
    default: []
  },
  followers: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['Guest', 'Gym', 'Instructor', 'Admin'],
    default: 'Guest'
  },
  activation: {
    active: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      default: generateRandomToken
    }
  },
  social: {
    google: String,
    facebook: String,
    slack: String
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      // delete ret.password
      // delete ret.createdAt
      delete ret.updatedAt
      return ret
    }
  }
})

userSchema.pre("save", function (next) {
  const user = this

  if (user.isModified("password")) {
    // Hash password
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then((salt) => {
        return bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash
          next()
        })
      })
      .catch((e) => next(e))
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.virtual("lessons", {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'user'
})

userSchema.virtual("reservations", {
  ref: 'Reservations',
  localField: '_id',
  foreignField: 'user'
})

userSchema.virtual("waitinglists", {
  ref: 'Waitinglist',
  localField: '_id',
  foreignField: 'user'
})

module.exports = model("User", userSchema)
