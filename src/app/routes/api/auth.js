import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { token } from '../../controllers/auth'
import { password } from '../../services/passport'

const router = Router()

router.post('/',
  body({ hardwareID: { type: String, required: true } }),
  password,
  token)

export default router
