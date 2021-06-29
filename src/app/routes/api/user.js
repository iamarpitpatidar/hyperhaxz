import { Router } from 'express'
import { token } from '../../services/passport'
import { showMe } from '../../controllers/user'

const router = Router()

router.get('/me',
  token(),
  showMe)

export default router
