import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})

router.get('/auth/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  })
})

router.get('/auth/register', (req, res) => {
  res.render('auth/register', {
    title: 'Sign Up'
  })
})

export default router
