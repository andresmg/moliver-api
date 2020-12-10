const {Schema, model, ObjectId} = require('mongoose')
const disciplines = require('../data/disciplines')
require('./User.model')
require('./Gimnasium.model')

const classroomSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  gym: {
    type: ObjectId,
    ref: 'Gym'
  },
  name: {
    type: String,
    trim: true
  },
  rows: {
    type: [Number]
  },
  discipline: {
    type: [String],
    enum: disciplines.map((c) => c.name),
    default: []
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

// userSchema.virtual("reviews", {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'user'
// })

// userSchema.virtual("products", {
//   ref: 'Product',
//   localField: '_id',
//   foreignField: 'user'
// })

module.exports = model("Classroom", classroomSchema)
