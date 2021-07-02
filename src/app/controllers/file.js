import File from '../models/file'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  File.countDocuments(query)
    .then(count => File.find(query, select, cursor)
      .then(files => {
        res.locals.files = files
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next))
}
