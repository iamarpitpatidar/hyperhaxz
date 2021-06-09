import { Router } from 'express'
import { index } from '../../controllers/user'

const router = Router()

router.get('/',
  index,
  (req, res) => {
    res.render('dashboard/users', {
      title: 'Users'
    })
  })

export default router
