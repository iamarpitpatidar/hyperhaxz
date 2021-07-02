import { Router } from 'express'
import key from './key'
import main from './main'
import shop from './shop'
import user from './user'
import file from './file'
import seller from './seller'
import profile from './profile'
import product from './product'
import subscription from './subscription'
import { allowRoles } from '../../helper'

const router = Router()

router.use('/', main)
router.use('/profile', profile)
router.use('/shop', allowRoles([], true), shop)
router.use('/files', allowRoles(['admin']), file)
router.use('/products', allowRoles(['admin']), product)
router.use('/sellers', allowRoles(['support', 'admin']), seller)
router.use('/activationKeys', allowRoles(['admin'], true), key)
router.use('/users', allowRoles(['support', 'admin'], true), user)
router.use('/subscriptions', subscription)

export default router
