import { Router } from 'express'
import { schema } from '../../../models/user'
import { middleware as body } from 'bodymen'
import { updatePassword } from '../../../controllers/user'

const router = Router()
const { password } = schema.tree

router.get('/', (req, res) => {
  res.render('dashboard/profile', {
    title: 'Profile',
    csrfToken: req.csrfToken()
  })
})

router.put('/update-password',
  body({
    currentPassword: password,
    newPassword: password
  }),
  updatePassword)

export default router