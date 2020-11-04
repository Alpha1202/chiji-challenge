import { Comment } from '../../db/models'
/**
 *
 *@description This class checks a table for the presence or absence of a row
 * @class FindPost
 */
class FindComment {
  

  /**
   *@description This method checks if there are comment in the table
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindPost
   */
  static async findAllPost(req, res, next) {
    const findAllPosts = await Article.findAll({})

    if (findAllPosts.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'no article found',
      })
    }
    return next()
  }

  /**
   * @description - checks if requester is author
   * @param {object} req the request body
   * @param {object} res the response body
   * @param {function} next passes the request to another function to be processed
   * @returns {function} next
   */
  static async checkIsOwner(req, res, next) {
    const { commentId } = req.params
    const { id } = req.decodedUser

    const comment = await Comment.findOne({
      where: {
        id: commentId,
      },
    })

    if (!comment || comment.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Requested comment does not exist',
      })
    }
    const { dataValues } = comment
    const { userId } = dataValues

    if (id !== userId) {
      return res.status(403).json({
        status: 403,
        message: `You don't have permission to perform this request!`,
      })
    }

    res.locals.article = dataValues
    return next()
  }

}

export default FindComment
