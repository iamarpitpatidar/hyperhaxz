import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})

router.get('/auth/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  })
})
router.post('/auth/login', (req, res) => {
  res.json(req.headers)
})

router.get('/auth/register', (req, res) => {
  res.render('auth/register', {
    title: 'Sign Up',
    csrfToken: req.csrfToken()
  })
})
router.post('/auth/register', (req, res) => {
  console.log(req.body)
})

export default router
