const {Schema, model, ObjectId} = require('mongoose')
require('./User.model')

const blogSchema = new Schema(
    {
        title: {
            type: String
        },
        content: {
            type: String
        },
        authorId: {
            type: ObjectId,
            ref: 'User'
        },
        picPath: {
            type: String
        }
    },
    {
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
    }
)

module.exports = model('Blog', blogSchema)
