import express from 'express'
import userController from '../controllers/user-controller.js'
import { authMiddleware } from '../middlewares/auth-middleware.js'

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);

export {
  userRouter
}