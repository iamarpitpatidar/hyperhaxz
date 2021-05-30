import mongoose from './mongoose'
import express from './express'

export default async function () {
  await mongoose()
  return await express()
}
