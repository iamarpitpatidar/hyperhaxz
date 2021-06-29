import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { token, purge } from '../../controllers/auth'
import { password, token as validate } from '../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  password(true),
  token)

router.delete('/token',
  validate(),
  purge)

export default router
