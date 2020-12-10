const {Schema, model, ObjectId} = require('mongoose')
require('./History.model')

const biopsySchema = new Schema({
    history: {
        type: [ObjectId],
        ref: 'History'
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





