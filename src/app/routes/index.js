import { Router } from 'express'
import main from './main'
import auth from './auth'
import dashboard from './dashboard'
import { checkUser, requireAuth } from '../helper'

const router = Router()

router.use(checkUser)
router.use('/', main)
router.use('/auth', auth)
router.use('/dashboard', requireAuth, dashboard)

export default router
