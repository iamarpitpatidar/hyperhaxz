import { Router } from 'express'
import key from './key'
import file from './file'
import main from './main'
import shop from './shop'
import user from './user'
import users from './users'
import seller from './seller'
import product from './product'
import { allowRoles } from '../../helper'

const router = Router()

router.use('/', main)
router.use('/user', user)
router.use('/files', allowRoles(['admin']), file)
router.use('/shop', allowRoles([], true), shop)
router.use('/products', allowRoles(['admin']), product)
router.use('/sellers', allowRoles(['support', 'admin']), seller)
router.use('/activationKeys', allowRoles(['admin'], true), key)
router.use('/users', allowRoles(['support', 'admin'], true), users)

export default router
