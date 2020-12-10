const {Schema, model, ObjectId} = require('mongoose')
const services = require('../data/services')
require('./User.model')
require('./Lesson.model')

const gymSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  services: {
    type: [String],
    enum: services.map((s) => s.name),
    default: []
  },
  role: {
    type: String,
    default: 'Gym'
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

gymSchema.virtual("lessons", {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'user'
})

module.exports = model("Gym", gymSchema)
