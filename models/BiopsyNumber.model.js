const {Schema, model} = require('mongoose')

const biopsyNumberSchema = new Schema({
    number: {
        type: Number,
        default: 1
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

module.exports = model("BiopsyNumber", biopsyNumberSchema)





