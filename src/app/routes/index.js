import { Router } from 'express'
import main from './main'
import auth from './auth'
import dashboard from './dashboard'
import { checkAuth } from '../helper'

const router = Router()

router.use('/', main)
router.use('/auth', auth)
router.use('/dashboard', checkAuth, dashboard)

export default router
