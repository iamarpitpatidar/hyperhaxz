import { Router } from 'express'

const router = Router()

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
router.post('/register', (req, res) => {
  console.log(req.body)
})

export default router
