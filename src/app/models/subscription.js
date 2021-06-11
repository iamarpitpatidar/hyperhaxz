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

subscriptionSchema.methods = {
  view(full) {
    const view = {}
    let fields = ['role', 'expiry']

    if (full) {
      fields = [...fields, 'activationKeyId']
    }

    fields.forEach(field => { view[field] = this[field] })
    return view
  }
}

const model = mongoose.model('Subscription', subscriptionSchema)

export const schema = model.schema
export default model
