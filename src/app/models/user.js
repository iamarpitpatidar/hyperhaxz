import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    minlength: 3,
    maxlength: 16
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'support', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  hardwareID: {
    type: String,
    trim: true,
    default: null
  },
  secret: {
    type: String,
    default: Math.random().toString(32).substring(2)
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  bcrypt.hash(this.password, 9).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['_id', 'username', 'status']

    if (full) {
      fields = [...fields, 'role', 'hardwareID', 'createdAt']
    }

    fields.forEach((field) => { view[field] = this[field] })
    return view
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

userSchema.plugin(mongooseKeywords, { paths: ['username'] })
const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
