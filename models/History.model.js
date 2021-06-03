const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const historySchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    visit_reason: {
        type: String
    },
    clinic_history: {
        type: String
    },
    diagnostics: {
        type: String
    },
    treatment: {
        type: String
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = doc._id
            ret.date = doc.createdAt
            delete ret._id
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt
            return ret
        }
    }
})

module.exports = model("History", historySchema)





