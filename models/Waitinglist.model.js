const {Schema, model, ObjectId} = require('mongoose')

const waitinglistSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: ObjectId,
    ref: 'Lesson',
    required: true
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


module.exports = model("Waitinglist", waitinglistSchema)
