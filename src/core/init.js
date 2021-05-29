import path from 'path'
import dotenv from 'dotenv-safe'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example')
  })
}

export default function (app) {

}
