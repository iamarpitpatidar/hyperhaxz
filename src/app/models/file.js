import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  size: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true })

fileSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['_id', 'name']
    if (full) fields = ['createdBy']

    fields.forEach((field) => { view[field] = this[field] })
    return view
  }
}

fileSchema.plugin(mongooseKeywords, { paths: ['name'] })
const model = mongoose.model('File', fileSchema)

export const schema = model.schema
export default model
