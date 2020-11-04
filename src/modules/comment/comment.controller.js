import { Comment } from '../../db/models'

/**
 * @description This controller handles comment request
 * @class CommentController
 */
class CommentController {
  /**
   * @static
   * @description The create comment method
   * @param  {object} req The req object
   * @param  {object} res The res object
   * @returns {object} json res
   * @memberof CommentController
   */
  static async postComment(req, res) {
    try {
      const articleId = res.locals.articleObject.id

      const { userName, imageUrl } = res.locals.articleObject.User
      const { commentBody } = req.body
      const userId = req.user

      const commentObject = {
        userId,
        articleId,
        commentBody,
      }

      const comment = await Comment.create(commentObject)

      const { id, createdAt, updatedAt } = comment
      return res.status(201).json({
        status: 201,
        message: 'Comment added successfully',
        data: [
          {
            id,
            commentBody,
            createdAt,
            updatedAt,
            author: {
              userName,
              imageUrl,
            },
          },
        ],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @static
   * @description The get all comment method
   * @param  {object} req The req object
   * @param  {object} res The res object
   * @returns {object} json res
   * @memberof CommentController
   */
  static async getAllPostsComments(req, res) {
    const { article } = res.locals
    const articleId = article.id

    try {
      const { count, rows: comments } = await Comment.findAndCountAll({
        where: { articleId },
        attributes: ['id', 'commentBody', 'createdAt'],
      })

      return res.status(200).json({
        status: 200,
        message: 'All comments fetched successfully',
        data: [
          {
            articleId,
            comments,
            totalComments: count,
          },
        ],
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   * @description - Deletes a comment
   * @static
   * @async
   * @param {object} req - delete comment request object
   * @param {object} res - delete comment response object
   * @returns {object} delete action response
   *
   */
  static async deleteComment(req, res) {
    try {
      const dataValues = res.locals.article

      const { id } = dataValues

      await Comment.destroy({ where: { id } })

      return res.status(200).json({
        status: 200,
        message: 'Comment successfully deleted',
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }
}

export default CommentController
