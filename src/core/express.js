import express from 'express'

export default async function (database) {
  const app = express()

  app.get('/', (req, res) => {
    res.send('Hello from HyperHaxZ v3')
  })
  return app
}
