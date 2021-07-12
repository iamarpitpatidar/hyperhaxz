import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  invoiceId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true })

const model = mongoose.model('File', orderSchema)

export const schema = model.schema
export default model
