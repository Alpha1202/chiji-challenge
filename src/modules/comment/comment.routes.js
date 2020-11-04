import { Router } from 'express';

import verify from '../../services/verifyToken'
import FindPost from '../post/post.model'
import CommentController from './comment.controller';
import FindComment from './comment.model'
import CommentValidation from '../../services/commentValidator';
import validate from '../../services/validate'


const router = Router();

const { validateComment, validateCommentId } = CommentValidation;


router.post(
  '/:slug/comments',
  verify,
  FindPost.getPostWithAuthor,
  FindPost.findPost,
  validateComment,
  validate,
  CommentController.postComment,
);

router.get(
  '/:slug/comments',
  verify,
  FindPost.findPost,
  CommentController.getAllPostsComments,
);

router.delete(
  '/delete/comment/:commentId',
  verify,
  FindComment.checkIsOwner,
  CommentController.deleteComment,
)

// router.get(
//   '/comments/:id',
//   verify,
//   findItem.findComment,
//   CommentController.getSingleComment,
// );

// router.patch(
//   '/comments/:id',
//   verify,
//   findItem.findComment,
//   CommentController.updateComment,
// );

// router.get(
//   '/comments/:id/history',
//   verify,
//   findItem.findComment,
//   CommentController.getCommentHistory,
// );

export default router;