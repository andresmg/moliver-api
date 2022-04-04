const {Schema, model} = require('mongoose')


const tabledataSchema = new Schema(
  {
    dataName: {
      type: String,
      required: [true, 'El nombre de la tabla es requerido'],
      trim: true,
    },
    fecha: {
      type: String,
      required: [true, 'La fecha es requerida'],
      trim: true,
    },
    hora: {
      type: String,
      required: [true, 'La hora es requerida'],
      trim: true,
    },
    consumo: {
      type: String,
      required: [true, 'El consumo es requerido'],
      trim: true,
    },
    precio: {
      type: String,
      required: [true, 'El precio es requerido'],
      trim: true,
    },
    coste: {
      type: String,
      required: [true, 'El coste es requerido'],
      trim: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        delete ret.__v
        delete ret.updatedAt
        return ret
      }
    }
  }
)

module.exports = model('Tabledata', tabledataSchema)