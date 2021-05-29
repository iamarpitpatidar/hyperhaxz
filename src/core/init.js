import mongoose from './mongoose'
import express from './express'

export default async function () {
  const database = await mongoose()

  return await express(database)
}
