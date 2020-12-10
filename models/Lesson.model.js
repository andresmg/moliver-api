const {Schema, model, ObjectId} = require('mongoose')
const disciplines = require('../data/disciplines')
require('./Instructor.model')
require('./Gimnasium.model')
require('./User.model')
require('./Classroom.model')

const lessonSchema = new Schema({
  user: {
    type: [ObjectId],
    ref: 'User'
  },
  gym: {
    type: ObjectId,
    ref: 'Gym'
  },
  classroom: {
    type: ObjectId,
    ref: 'Classroom'
  },
  instructor: {
    type: ObjectId,
    ref: 'Instructor'
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  zipcode: {
    type: Number,
    required: [true, 'Zipcode is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  discipline: {
    type: [String],
    enum: disciplines.map((c) => c.name),
    default: []
  },
  date: {
    type: Date,
    required: [true, 'Lesson date is required']
  },
  duration: {
    type: Number
  },
  details: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: true [true, 'Capacity is required'],
    trim: true
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

lessonSchema.virtual("reservations", {
  ref: 'Reservations',
  localField: '_id',
  foreignField: 'lesson'
})

module.exports = model("Lesson", lessonSchema)


