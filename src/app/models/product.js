import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import mongooseINT32 from 'mongoose-int32'
const Int32 = mongooseINT32.loadType(mongoose)

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sellix: {
    type: [{
      _id: { type: String, required: true },
      price: { type: Int32, required: true },
      length: { type: Number, required: true },
      gateways: {
        type: [String],
        enum: ['FREE', 'PAYPAL', 'BITCOIN', 'ETHEREUM', 'LITECOIN', 'PERFECT_MONEY', 'BITCOIN_CASH', 'SKRILL', 'STRIPE', 'CASH_APP'],
        default: ['BITCOIN', 'CASH_APP']
      }
    }]
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isSeller: {
    type: Boolean,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['live', 'maintenance', 'offline'],
    default: 'live'
  }
}, { timestamps: true })

productSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['_id', 'name', 'file', 'isSeller', 'version', 'status', 'sellix']

    if (full) fields = ['username', 'status']

    fields.forEach((field) => { view[field] = this[field] })
    return view
  }
}

productSchema.plugin(mongooseKeywords, { paths: ['name', 'role', 'status'] })
const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
