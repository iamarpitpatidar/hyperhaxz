import { Router } from 'express'
import { updatePassword } from '../controllers/user'
import { middleware as body } from 'bodymen'
import { schema } from '../models/user'

const router = Router()
const { password } = schema.tree

router.put('/update-password',
  body({
    currentPassword: password,
    newPassword: password
  }),
  updatePassword)

export default router
