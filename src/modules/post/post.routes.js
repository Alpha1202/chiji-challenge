import { Router } from 'express'

import PostController from './post.controller'
import verify from '../../services/verifyToken'
import { parser } from '../../services/imageServices'
import postValidator from '../../services/postValidator'
import validate from '../../services/validate'
import FindPost from './post.model'
import { UserHelper } from '../user/user.model'

const router = Router()

const {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  getAllPostsByAUser,
  deletePost,
} = PostController

const { detailsValidator, slugValidator } = postValidator

router.post(
  '/posts/',
  verify,
  parser.array('images', 10),
  detailsValidator,
  validate,
  createPost,
)

router.get('/post/:slug', FindPost.findPost, getPost)

router.get('/post/user/:userId', UserHelper.findUser, getAllPostsByAUser)

router.get('/allposts', FindPost.findAllPost, getAllPosts)

router.patch(
  '/edit/post/:slug',
  verify,
  parser.array('images', 10),
  detailsValidator,
  validate,
  updatePost,
)

router.delete(
  '/delete/post/:slug',
  verify,
  slugValidator,
  validate,
  FindPost.checkIsOwner,
  deletePost,
)

export default router
