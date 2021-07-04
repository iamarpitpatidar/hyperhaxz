import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import mongooseINT32 from 'mongoose-int32'
const Int32 = mongooseINT32.loadType(mongoose)

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Int32,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  sellixID: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  filename: {
    type: mongoose.Schema.Types.ObjectId
  },
  isSeller: {
    type: Boolean,
    required: true
  },
  gateways: {
    type: [String],
    enum: ['FREE', 'PAYPAL', 'BITCOIN', 'ETHEREUM', 'LITECOIN', 'PERFECT_MONEY', 'BITCOIN_CASH', 'SKRILL', 'STRIPE', 'CASH_APP'],
    required: true
  },
  version: {
    type: Number,
    default: 0.1
  },
  status: {
    type: String,
    enum: ['live', 'maintenance', 'offline'],
    default: 'live'
  }
}, { timestamps: true })

productSchema.plugin(mongooseKeywords, { paths: ['name', 'sellixID', 'gateways', 'status'] })
const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
