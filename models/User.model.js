const {Schema, model} = require('mongoose')
const bcrypt = require("bcrypt")
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const SALT_WORK_FACTOR = 10

const generateRandomToken = () => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const Biopsy = require('./Biopsy.model')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [1, 'El nombre debe tener al menos dos caracteres'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El Email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'El Email es inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener ocho caracteres']
  },
  dni: {
    type: String,
    required: [true, 'La cédula es obligatoria'],
    minlength: [3, 'La cédula debe tener al menos tres números'],
    trim: true
  },
  reference: {
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
  birthdate: {
    type: Date
  },
  sex: {
    type: String,
    enum: ['Hombre', 'Mujer']
  },
  role: {
    type: String,
    enum: ['Guest', 'Admin'],
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
    google: String
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      //delete ret.password
      //delete ret.createdAt
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

userSchema.virtual("biopsies", {
  ref: 'Biopsy',
  localField: '_id',
  foreignField: 'user'
})

module.exports = model("User", userSchema)
