import { Router } from 'express'

import UserController from './user.controller'
import { Auth } from '../../services/helpers'
import { parser } from '../../services/imageServices'
import profileChecker from '../../services/profileValidator'
import authValidator from '../../services/authValidator'
import validate from '../../services/validate'
import { UserHelper } from './user.model'
import verify from '../../services/verifyToken'

const { usernameValidator, emailValidator, passwordValidator } = authValidator

const router = Router()

router.post(
  '/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  validate,
  UserHelper.checkExistingUser,
  UserController.createAccount,
)

router.post(
  '/login',
  emailValidator,
  passwordValidator,
  validate,
  UserController.login,
)

router.get('/profiles/:userId', UserController.getUserProfile)


router.put(
  '/profiles/:id',
  verify,
  parser.single('avatar'),
  profileChecker,
  UserController.updateProfile,
)

export default router
