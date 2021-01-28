const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const biopsySchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    number: {
        type: String
    },
    reference: {
        type: String
    },
    material: {
        type: String
    },
    clinic_diagnosis: {
        type: String
    },
    report: {
        type: String
    },
    diagnostics: {
        type: String
    }
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

module.exports = model("Biopsy", biopsySchema)





