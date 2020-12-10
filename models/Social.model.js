const {Schema, model} = require('mongoose')

const socialSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
  },
  description: {
    type: String
  },
  points: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['ONG', 'Pyme'],
    default: 'ONG'
  },
  url: {
    type: String,
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

module.exports = model("Social", socialSchema)
