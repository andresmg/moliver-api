const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const recipeSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    recipe: {
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

module.exports = model("Recipe", recipeSchema)





