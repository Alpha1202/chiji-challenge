import { Article, User } from '../../db/models'
/**
 *
 *@description This class checks a table for the presence or absence of a row
 * @class FindPost
 */
class FindPost {
  /**
   *@description This function checks if a post exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   * @memberof FindPost
   */
  static async findPost(req, res, next) {
    const { slug } = req.params
    try {
      const post = await Article.findOne({
        where: { slug },
        attributes: {
          exclude: ['updatedAt'],
        },
      })

      if (!post) {
        return res.status(404).json({
          status: 404,
          message: 'Post not found',
        })
      }
      res.locals.article = post
      return next()
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      })
    }
  }

  /**
   *@description This method checks if there are posts in the table
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
    const { slug } = req.params
    const { id } = req.decodedUser

    const post = await Article.findOne({
      where: {
        slug,
      },
    })

    if (!post || post.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Requested post does not exist',
      })
    }
    const { dataValues } = post
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

  /**
   * @static
   * @description Method to fetch a post with the user
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} object
   */
  static async getPostWithAuthor(req, res, next) {
    const post = await Article.findOne({
      include: [
        {
          model: User,
          attributes: ['id', 'userName', 'imageUrl'],
        },
      ],
      attributes: ['id', 'body', 'createdAt', 'updatedAt'],
      where: {
        slug: req.params.slug,
      },
    });

    if (!post) {
      return res.status(404).json({
        status: 404,
        message: 'Post not found',
      });
    }
    res.locals.articleObject = post;
    next();
  }
}

export default FindPost
