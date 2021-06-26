import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { password } from '../../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  password)

export default router
