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
    default: 1000000
  },
  sellixID: {
    type: String,
    unique: true,
    index: true,
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
    enum: ['live', 'maintenance', 'offline']
  }
}, { timestamps: true })

productSchema.plugin(mongooseKeywords, { paths: ['name', 'sellixID', 'gateways', 'status'] })
const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
