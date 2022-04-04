const {Schema, model} = require('mongoose')

const drugSchema = new Schema({
    comercial_name: {
        type: String
    },
    generic_name: {
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

module.exports = model("Drug", drugSchema)





