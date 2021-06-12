import mongoose, { Schema } from 'mongoose'
import User from './user'
import Subscription from './subscription'
import { v5 as uuidv5 } from 'uuid'

const inviteSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    default: 1
  },
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  soldTo: {
    type: String,
    enum: ['user', 'seller'],
    default: 'user'
  },
  used: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

inviteSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['_id', 'role', 'length', 'orderID', 'createdBy']

    if (full) {
      fields = [...fields, 'code', 'soldTo', 'used', 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] })
    return view
  }
}

const model = mongoose.model('Invite', inviteSchema)

export const schema = model.schema
export default model
