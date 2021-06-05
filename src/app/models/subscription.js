import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new Schema({
  activationKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true,
    default: Date.now() + (24 * 60 * 60 * 1000)
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
})

const model = mongoose.model('Subscription', subscriptionSchema)

export const schema = model.schema
export default model
