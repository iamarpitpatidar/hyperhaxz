import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { schema } from '../models/user'
import { create } from '../controllers/user'
import { validate } from '../middlewares/subscription'
import { password as passwordAuth } from '../services/passport'

const router = Router()
const { username, password } = schema.tree

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  })
})
router.post('/login', passwordAuth())

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/auth/login')
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Sign Up',
    csrfToken: req.csrfToken()
  })
})
router.post('/register',
  body({
    username,
    password,
    activationKey: { type: String, required: true }
  }),
  validate,
  create)

export default router
