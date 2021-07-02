import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['archived', 'active'],
    default: 'active'
  }
}, { timestamps: true })

fileSchema.plugin(mongooseKeywords, { paths: ['name'] })
const model = mongoose.model('File', fileSchema)

export const schema = model.schema
export default model
