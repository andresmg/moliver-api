const {Schema, model, ObjectId} = require('mongoose')
const disciplines = require('../data/disciplines')
require('./User.model')

const instructorSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  quote: {
    type: String
  },
  disciplines: {
    type: [String],
    enum: disciplines.map((d) => d.name),
    default: []
  },
  role: {
    type: String,
    default: 'Instructor'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      delete ret.password
      delete ret.createdAt
      delete ret.updatedAt
      return ret
    }
  }
})

module.exports = model("Instructor", instructorSchema)
