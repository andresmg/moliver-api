const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const historySchema = new Schema({
    user: {
        type: [ObjectId],
        ref: 'User'
    },
    title: {
        type: String
    },
    resume: {
        type: String
    },
    treatment: {
        type: String,
        trim: true,
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

module.exports = model("History", historySchema)