import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { create } from '../controllers/auth'
import { schema } from '../models/user'

const router = Router()
const { username, password } = schema.tree

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  })
})
router.post('/login', (req, res) => {
  res.json(req.headers)
})

router.get('/register', (req, res) => {
  res.render('auth/register', {
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
  create)

export default router
