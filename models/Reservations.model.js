const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const reservationSchema = new Schema({
  row: {
    type: Number
  },
  column: {
    type: Number
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: ObjectId,
    ref: 'Lesson',
    required: true
  },
  points: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      delete ret.createdAt
      delete ret.updatedAt
      return ret
    }
  }
})


module.exports = model("Reservations", reservationSchema)
