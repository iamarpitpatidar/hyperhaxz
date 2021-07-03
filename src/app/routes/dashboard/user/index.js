import { Router } from 'express'
import profile from './profile'
import subscription from './subscription'

const router = Router()

router.use('/profile', profile)
router.use('/subscriptions', subscription)

export default router
