import { unlinkSync, existsSync } from 'fs'
import mongoose from 'mongoose'
import File from '../models/file'
import User from '../models/user'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  const sort = {
    name: { name: 1 },
    status: { status: 1 },
    user: { createdBy: 1 },
    date: { createdAt: 1 }
  }
  const key = Object.keys(cursor.sort)[0]
  if (Object.keys(sort).includes(key)) cursor.sort = sort[key]
  else cursor.sort = { status: 1 }

  File.countDocuments(query)
    .then(count => File.find(query, select, cursor).lean()
      .then(async files => {
        const UIDs = files.map(each => each.createdBy)
        const users = await User.find({ _id: { $in: UIDs } }, { _id: true, username: true })

        function findUser (_id) {
          const found = users.find(each => each._id.toString() === _id.toString())
          return found ? found.username : 'Deleted User'
        }
        return files.map(file => Object.assign({}, file, { createdBy: findUser(file.createdBy) }))
      })
      .then(files => {
        res.locals.files = files
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next))
}
export const purge = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.query.id)) return res.sendStatus(400)

  File.findByIdAndDelete(req.query.id, (error, file) => {
    if (error) res.sendStatus(500)

    const filename = `uploads/${file.filename}`
    if (existsSync(filename)) unlinkSync(filename)
    return existsSync(filename)
  }).then(file => {
    req.flash('message', file ? 'Something\'s wrong. File not deleted' : 'File has been successfully deleted')
    res.redirect('/dashboard/files')
  })
}
export const save = (req, res) => {
  if (req.file && req.body && Object.entries(req.file) && Object.entries(req.body)) {
    if (!req.file.filename || !req.file.originalname || !req.file.size || !req.body.name) return res.sendStatus(400)

    File.create({
      name: req.body.name,
      filename: req.file.filename,
      size: req.file.size,
      createdBy: req.user._id
    }).then(file => file ? req.flash('message', 'File uploaded!') && res.redirect('/dashboard/files') : res.sendStatus(500))
      .catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) return req.flash('message', 'File already exists') && res.redirect('/dashboard/files')
        else req.flash('message', 'Internal server Error') && res.redirect('/dashboard/files')
      })
  } else res.sendStatus(400)
}
