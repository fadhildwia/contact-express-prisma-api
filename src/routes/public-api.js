import express from 'express'
import userController from '../controllers/user-controller.js'

const publicRouter = new express.Router()
publicRouter.get('/', (req, res) => {res.send("Express on Vercel")})
publicRouter.post('/api/users', userController.register)
publicRouter.post('/api/users/login', userController.login)

export {
  publicRouter
}