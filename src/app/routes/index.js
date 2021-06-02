import { Router } from 'express'
import main from './main'
import auth from './auth'

const router = Router()

router.use('/', main)
router.use('/auth', auth)

export default router
