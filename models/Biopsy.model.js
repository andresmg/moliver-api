const {Schema, model, ObjectId} = require('mongoose')
require('./Date.model')
require('./User.model')

const biopsySchema = new Schema({
    user: {
        type: [ObjectId],
        ref: 'User',
        required: true
    },
    date: {
        type: [ObjectId],
        ref: 'Date',
        required: true
    },
    pics: {
        type: [String],
        default: []
    },
    resume: {
        type: String
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

module.exports = model("Biopsy", biopsySchema)





